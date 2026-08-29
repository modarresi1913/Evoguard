import { db } from '@/lib/db';
import { fetchOpenPRs, fetchChangedFiles, type ChangedFile } from '@/lib/evoguard/github-api';

export interface ConflictResult {
  repoFullName: string;
  prNumberA: number;
  prNumberB: number;
  sharedFiles: string[];
  fileCount: number;
  severity: 'info' | 'warning' | 'critical';
}

function computeSeverity(sharedCount: number, filesA: number, filesB: number): 'info' | 'warning' | 'critical' {
  const maxFiles = Math.max(filesA, filesB, 1);
  const overlapRatio = sharedCount / maxFiles;
  if (overlapRatio > 0.5 || sharedCount >= 10) return 'critical';
  if (overlapRatio > 0.2 || sharedCount >= 3) return 'warning';
  return 'info';
}

/**
 * Detect file-level conflicts between an incoming PR and all other open PRs.
 * Returns newly detected conflicts (not already in DB).
 */
export async function detectConflicts(params: {
  token: string;
  owner: string;
  repo: string;
 triggerPrNumber: number;
  triggerPrFiles: ChangedFile[];
}): Promise<ConflictResult[]> {
  const { token, owner, repo, triggerPrNumber, triggerPrFiles } = params;
  const repoFullName = `${owner}/${repo}`;
  const triggerFilenames = new Set(triggerPrFiles.map((f) => f.filename));

  // Fetch all open PRs (excluding the trigger PR)
  const openPRs = await fetchOpenPRs({ token, owner, repo });
  const otherPRs = openPRs.filter((pr) => pr.number !== triggerPrNumber);

  // Fetch files for each open PR
  const prFilesMap = new Map<number, ChangedFile[]>();
  await Promise.allSettled(
    otherPRs.map(async (pr) => {
      const files = await fetchChangedFiles({ token, owner, repo, prNumber: pr.number });
      prFilesMap.set(pr.number, files);
    })
  );

  // Detect shared files
  const newConflicts: ConflictResult[] = [];
  for (const [prNum, files] of prFilesMap) {
    const otherFilenames = new Set(files.map((f) => f.filename));
    const shared: string[] = [];
    for (const f of triggerFilenames) {
      if (otherFilenames.has(f)) shared.push(f);
    }
    if (shared.length === 0) continue;

    const lo = Math.min(triggerPrNumber, prNum);
    const hi = Math.max(triggerPrNumber, prNum);
    const severity = computeSeverity(shared.length, triggerPrFiles.length, files.length);

    // Upsert (use raw SQLite for ON CONFLICT)
    await db.$executeRawUnsafe(`
      INSERT INTO ConflictDetection (repoFullName, prNumberA, prNumberB, sharedFiles, fileCount, severity)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(repoFullName, prNumberA, prNumberB) DO UPDATE SET
        sharedFiles = excluded.sharedFiles,
        fileCount = excluded.fileCount,
        severity = excluded.severity,
        detectedAt = datetime('now')
    `, repoFullName, lo, hi, JSON.stringify(shared), shared.length, severity);

    newConflicts.push({
      repoFullName,
      prNumberA: lo,
      prNumberB: hi,
      sharedFiles: shared,
      fileCount: shared.length,
      severity,
    });
  }

  return newConflicts;
}

/** Resolve a conflict when one of the PRs is merged or closed */
export async function resolveConflicts(params: {
  repoFullName: string;
  prNumber: number;
  resolution: 'merged_a' | 'merged_b' | 'closed' | 'manual';
}) {
  await db.conflictDetection.updateMany({
    where: {
      repoFullName: params.repoFullName,
      OR: [
        { prNumberA: params.prNumber },
        { prNumberB: params.prNumber },
      ],
      resolvedAt: null,
    },
    data: {
      resolvedAt: new Date(),
      resolution: params.resolution,
    },
  });
}
