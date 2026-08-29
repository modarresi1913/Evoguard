import { db } from '@/lib/db';

export interface DAGNode {
  prNumber: number;
  prTitle: string | null;
  author: string | null;
  inDegree: number;      // edges pointing TO this node
  outEdges: string[];     // shared files on each outgoing edge
}

export interface MergeOrder {
  repoFullName: string;
  totalNodes: number;
  orderedPRs: Array<{
    prNumber: number;
    prTitle: string | null;
    author: string | null;
    canMergeNow: boolean;  // inDegree === 0
    blockedBy: number[];    // parent PRs not yet merged
    sharedFileCount: number;
  }>;
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

  for (const c of conflicts) {
    // Lower PR number = parent (should merge first — simpler, earlier change)
    const parentPr = Math.min(c.prNumberA, c.prNumberB);
    const childPr = Math.max(c.prNumberA, c.prNumberB);

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
