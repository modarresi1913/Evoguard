import { db } from '@/lib/db';

// ---- Types ----

export interface DAGNode {
  prNumber: number;
  prTitle: string | null;
  author: string | null;
  inDegree: number;
  outEdges: string[];
}

export interface DAGEdge {
  parentPrNumber: number;
  childPrNumber: number;
  sharedFiles: string[];
  fileCount: number;
  satisfied: boolean;
}

export interface DAGGraph {
  repoFullName: string;
  nodes: Array<{
    prNumber: number;
    prTitle: string | null;
    author: string | null;
    inDegree: number;
    outDegree: number;
  }>;
  edges: DAGEdge[];
  hasCycle: boolean;
  totalNodes: number;
  totalEdges: number;
}

export interface MergeOrder {
  repoFullName: string;
  totalNodes: number;
  orderedPRs: Array<{
    prNumber: number;
    prTitle: string | null;
    author: string | null;
    canMergeNow: boolean;
    blockedBy: number[];
    sharedFileCount: number;
  }>;
}

// ---- Cycle Detection (DFS-based) ----

/**
 * Detect cycles in a directed graph using iterative DFS with 3-color marking.
 * Returns true if adding candidateEdge would create a cycle.
 * Used as a guard before inserting new edges.
 */
export function wouldCreateCycle(
  existingEdges: Array<{ parent: number; child: number }>,
  candidateParent: number,
  candidateChild: number,
): boolean {
  // Build adjacency from existing edges
  const adj = new Map<number, number[]>();
  for (const e of existingEdges) {
    const list = adj.get(e.parent) ?? [];
    list.push(e.child);
    adj.set(e.parent, list);
  }

  // If candidateChild can already reach candidateParent via existing edges,
  // adding candidateParent -> candidateChild would create a cycle.
  const visited = new Set<number>();
  const stack = [candidateChild];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node === candidateParent) return true;
    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = adj.get(node) ?? [];
    for (const n of neighbors) {
      if (!visited.has(n)) stack.push(n);
    }
  }

  return false;
}

/**
 * Full cycle detection on the entire edge set.
 * Returns an array of PR numbers that form a cycle, or empty array if acyclic.
 */
export function detectCycles(edges: Array<{ parent: number; child: number }>): number[][] {
  const adj = new Map<number, number[]>();
  const allNodes = new Set<number>();

  for (const e of edges) {
    allNodes.add(e.parent);
    allNodes.add(e.child);
    const list = adj.get(e.parent) ?? [];
    list.push(e.child);
    adj.set(e.parent, list);
  }

  const WHITE = 0; // unvisited
  const GRAY = 1;  // in current DFS path
  const BLACK = 2; // fully explored

  const color = new Map<number, number>();
  for (const n of allNodes) color.set(n, WHITE);

  const cycles: number[][] = [];
  const path: number[] = [];

  function dfs(node: number): boolean {
    color.set(node, GRAY);
    path.push(node);

    for (const neighbor of (adj.get(node) ?? [])) {
      const c = color.get(neighbor);
      if (c === GRAY) {
        // Found cycle — extract it
        const cycleStart = path.indexOf(neighbor);
        cycles.push(path.slice(cycleStart));
      } else if (c === WHITE) {
        dfs(neighbor);
      }
    }

    path.pop();
    color.set(node, BLACK);
    return false;
  }

  for (const n of allNodes) {
    if (color.get(n) === WHITE) dfs(n);
  }

  return cycles;
}

/**
 * Build DAG edges from conflict data.
 * Called after conflict detection: for each conflict between two OPEN PRs,
 * create an ordering edge suggesting which should merge first.
 * The PR with the LOWER number (earlier) becomes the parent.
 */
export async function buildDAGFromConflicts(repoFullName: string) {
  const conflicts = await db.conflictDetection.findMany({
    where: { repoFullName, resolvedAt: null },
  });

  // Fetch existing edges for cycle guard
  const existingEdges = await db.decisionDAGEdge.findMany({
    where: { repoFullName },
    select: { parentPrNumber: true, childPrNumber: true },
  });

  for (const c of conflicts) {
    // Lower PR number = parent (should merge first — simpler, earlier change)
    const parentPr = Math.min(c.prNumberA, c.prNumberB);
    const childPr = Math.max(c.prNumberA, c.prNumberB);

    // Cycle guard: skip if this edge would create a cycle
    if (wouldCreateCycle(
      existingEdges.map((e) => ({ parent: e.parentPrNumber, child: e.childPrNumber })),
      parentPr,
      childPr,
    )) {
      console.log(`[EvoGuard DAG] Skipping edge ${parentPr} -> ${childPr}: would create cycle`);
      continue;
    }

    await db.$executeRawUnsafe(`
      INSERT INTO DecisionDAGEdge (repoFullName, parentPrNumber, childPrNumber, sharedFiles, fileCount, reason)
      VALUES (?, ?, ?, ?, ?, 'file_overlap')
      ON CONFLICT(repoFullName, parentPrNumber, childPrNumber) DO UPDATE SET
        sharedFiles = excluded.sharedFiles,
        fileCount = excluded.fileCount,
        satisfied = CASE WHEN excluded.satisfied = 1 THEN 1 ELSE DecisionDAGEdge.satisfied END
    `, repoFullName, parentPr, childPr, c.sharedFiles, c.fileCount);
  }
}

/**
 * Mark DAG edges as satisfied when a PR is merged.
 * All edges where this PR is the parent become satisfied.
 */
export async function satisfyDAGEdges(repoFullName: string, mergedPrNumber: number) {
  await db.decisionDAGEdge.updateMany({
    where: { repoFullName, parentPrNumber: mergedPrNumber, satisfied: false },
    data: { satisfied: true },
  });
  // Remove edges where this PR is the child (no longer relevant)
  await db.decisionDAGEdge.deleteMany({
    where: { repoFullName, childPrNumber: mergedPrNumber },
  });
}

/**
 * Compute topological merge order for open PRs in a repo.
 * Returns PRs that can merge now (inDegree=0) first, then blocked PRs.
 */
export async function computeMergeOrder(repoFullName: string): Promise<MergeOrder> {
  // Get all unsatisfied edges
  const edges = await db.decisionDAGEdge.findMany({
    where: { repoFullName, satisfied: false },
  });

  // Build adjacency + in-degree
  const inDegree = new Map<number, number>();
  const outFiles = new Map<number, string[]>();
  const prInfo = new Map<number, { prTitle: string | null; author: string | null }>();

  for (const e of edges) {
    inDegree.set(e.childPrNumber, (inDegree.get(e.childPrNumber) ?? 0) + 1);
    inDegree.set(e.parentPrNumber, inDegree.get(e.parentPrNumber) ?? 0);

    const files: string[] = JSON.parse(e.sharedFiles);
    const existing = outFiles.get(e.parentPrNumber) ?? [];
    outFiles.set(e.parentPrNumber, [...existing, ...files]);

    // Get PR info from latest evidence snapshot
    if (!prInfo.has(e.parentPrNumber)) {
 const snap = await db.evidenceSnapshot.findFirst({
        where: { prNumber: e.parentPrNumber, repoFullName },
        orderBy: { createdAt: 'desc' },
      });
      prInfo.set(e.parentPrNumber, { prTitle: snap?.prTitle ?? null, author: null });
    }
    if (!prInfo.has(e.childPrNumber)) {
      const snap = await db.evidenceSnapshot.findFirst({
        where: { prNumber: e.childPrNumber, repoFullName },
        orderBy: { createdAt: 'desc' },
      });
      prInfo.set(e.childPrNumber, { prTitle: snap?.prTitle ?? null, author: null });
    }
  }

  // Collect all unique PRs
  const allPRs = new Set<number>();
  for (const e of edges) { allPRs.add(e.parentPrNumber); allPRs.add(e.childPrNumber); }

  // Build blockedBy map
  const blockedBy = new Map<number, number[]>();
  for (const e of edges) {
    const list = blockedBy.get(e.childPrNumber) ?? [];
    if (!list.includes(e.parentPrNumber)) list.push(e.parentPrNumber);
    blockedBy.set(e.childPrNumber, list);
  }

  // Compute total shared files per PR (union of all shared files across edges)
  const sharedFileCount = new Map<number, number>();
  for (const e of edges) {
    const files: string[] = JSON.parse(e.sharedFiles);
    // Parent
    const parentSet = new Set(sharedFileCount.has(e.parentPrNumber) ? [] : undefined);
    sharedFileCount.set(e.parentPrNumber, (sharedFileCount.get(e.parentPrNumber) ?? 0) + files.length);
    // Child
    sharedFileCount.set(e.childPrNumber, (sharedFileCount.get(e.childPrNumber) ?? 0) + files.length);
  }

  // Sort: canMergeNow first (inDegree=0), then by PR number
  const orderedPRs = Array.from(allPRs)
    .map((prNum) => ({
      prNumber: prNum,
      prTitle: prInfo.get(prNum)?.prTitle ?? null,
      author: prInfo.get(prNum)?.author ?? null,
      canMergeNow: (inDegree.get(prNum) ?? 0) === 0,
      blockedBy: blockedBy.get(prNum) ?? [],
      sharedFileCount: sharedFileCount.get(prNum) ?? 0,
    }))
    .sort((a, b) => {
      // canMerge first
      if (a.canMergeNow !== b.canMergeNow) return a.canMergeNow ? -1 : 1;
      // then by PR number (lower = earlier)
      return a.prNumber - b.prNumber;
    });

  return {
    repoFullName,
    totalNodes: allPRs.size,
    orderedPRs,
  };
}

/**
 * Get the full DAG graph structure for visualization.
 * Returns nodes, edges, and cycle detection status.
 */
export async function getDAGGraph(repoFullName: string): Promise<DAGGraph> {
  const edges = await db.decisionDAGEdge.findMany({
    where: { repoFullName, satisfied: false },
  });

  // Build node set with in/out degrees
  const nodeMap = new Map<number, { prTitle: string | null; author: string | null; inDegree: number; outDegree: number }>();

  for (const e of edges) {
    if (!nodeMap.has(e.parentPrNumber)) {
      const snap = await db.evidenceSnapshot.findFirst({
        where: { prNumber: e.parentPrNumber, repoFullName },
        orderBy: { createdAt: 'desc' },
      });
      nodeMap.set(e.parentPrNumber, { prTitle: snap?.prTitle ?? null, author: null, inDegree: 0, outDegree: 0 });
    }
    if (!nodeMap.has(e.childPrNumber)) {
      const snap = await db.evidenceSnapshot.findFirst({
        where: { prNumber: e.childPrNumber, repoFullName },
        orderBy: { createdAt: 'desc' },
      });
      nodeMap.set(e.childPrNumber, { prTitle: snap?.prTitle ?? null, author: null, inDegree: 0, outDegree: 0 });
    }
    nodeMap.get(e.parentPrNumber)!.outDegree++;
    nodeMap.get(e.childPrNumber)!.inDegree++;
  }

  const graphEdges: DAGEdge[] = edges.map((e) => ({
    parentPrNumber: e.parentPrNumber,
    childPrNumber: e.childPrNumber,
    sharedFiles: JSON.parse(e.sharedFiles) as string[],
    fileCount: e.fileCount,
    satisfied: e.satisfied,
  }));

  // Check for cycles
  const cycles = detectCycles(edges.map((e) => ({ parent: e.parentPrNumber, child: e.childPrNumber })));

  return {
    repoFullName,
    nodes: Array.from(nodeMap.entries()).map(([prNumber, info]) => ({
      prNumber,
      ...info,
    })),
    edges: graphEdges,
    hasCycle: cycles.length > 0,
    totalNodes: nodeMap.size,
    totalEdges: edges.length,
  };
}
