import { NextRequest, NextResponse } from 'next/server';
import { computeMergeOrder } from '@/lib/evoguard/dag-builder';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get('repo');

  if (!repo) {
    return NextResponse.json({ error: 'repo query parameter is required' }, { status: 400 });
  }

  try {
    const order = await computeMergeOrder(repo);
    return NextResponse.json({ data: order });
  } catch (err) {
    console.error('[EvoGuard] DAG computation failed:', err);
    return NextResponse.json({ error: 'DAG computation failed' }, { status: 500 });
  }
}
