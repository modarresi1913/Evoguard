import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ decisionId: string }> }
) {
  const { decisionId } = await params;

  const record = await db.decisionRecord.findUnique({
    where: { decisionId },
    include: {
      evidenceSnapshots: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!record) {
    return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: record.id,
      decisionId: record.decisionId,
      prNumber: record.prNumber,
      repoFullName: record.repoFullName,
      mergeCommitSha: record.mergeCommitSha,
      author: record.author,
      prTitle: record.prTitle,
      prBody: record.prBody,
      createdAt: record.createdAt.toISOString(),
      evidenceSnapshots: record.evidenceSnapshots.map((s) => ({
        id: s.id,
        evidenceType: s.evidenceType,
        headSha: s.headSha,
        changedFiles: safeJsonParse(s.changedFiles, []),
        diffStats: safeJsonParse(s.diffStats),
        reviewComments: safeJsonParse(s.reviewComments, []),
        checkStatuses: safeJsonParse(s.checkStatuses, []),
        prTitle: s.prTitle,
        createdAt: s.createdAt.toISOString(),
      })),
    },
  });
}

function safeJsonParse<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}
