import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get('repo');
  const prNumber = searchParams.get('prNumber');
  const author = searchParams.get('author');
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100);
  const offset = Number(searchParams.get('offset') ?? 0);

  const where: Record<string, unknown> = {};
  if (repo) where.repoFullName = repo;
  if (prNumber) where.prNumber = Number(prNumber);
  if (author) where.author = author;

  const [records, total] = await Promise.all([
    db.decisionRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        _count: { select: { evidenceSnapshots: true } },
      },
    }),
    db.decisionRecord.count({ where }),
  ]);

  return NextResponse.json({
    data: records.map((r) => ({
      id: r.id,
      decisionId: r.decisionId,
      prNumber: r.prNumber,
      repoFullName: r.repoFullName,
      mergeCommitSha: r.mergeCommitSha,
      author: r.author,
      prTitle: r.prTitle,
      createdAt: r.createdAt.toISOString(),
      evidenceSnapshotCount: r._count.evidenceSnapshots,
    })),
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
}
