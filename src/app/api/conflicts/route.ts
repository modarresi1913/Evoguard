import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get('repo');
  const activeOnly = searchParams.get('active') !== 'false';

  const where: Record<string, unknown> = {};
  if (repo) where.repoFullName = repo;
  if (activeOnly) where.resolvedAt = null;

  const conflicts = await db.conflictDetection.findMany({
    where,
    orderBy: { detectedAt: 'desc' },
    take: 100,
  });

  return NextResponse.json({
    data: conflicts.map((c) => ({
      id: c.id,
      repoFullName: c.repoFullName,
      prNumberA: c.prNumberA,
      prNumberB: c.prNumberB,
      sharedFiles: safeJsonParse(c.sharedFiles, []),
      fileCount: c.fileCount,
      severity: c.severity,
      detectedAt: c.detectedAt.toISOString(),
      resolvedAt: c.resolvedAt?.toISOString() ?? null,
      resolution: c.resolution,
    })),
  });
}

function safeJsonParse<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str) as T; } catch { return fallback; }
}
