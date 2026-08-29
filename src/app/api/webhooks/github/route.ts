import { NextRequest, NextResponse } from 'next/server';
import {
  verifyWebhookSignature,
  isMergedPrEvent,
  isEvidencePrEvent,
  type PullRequestMergedEvent,
  type PullRequestEvidenceEvent,
} from '@/lib/evoguard/github-webhook';
import { generateDecisionId, parseDecisionId } from '@/lib/evoguard/uuidv7';
import {
  createCommitStatus,
  createPullRequestComment,
  collectEvidence,
} from '@/lib/evoguard/github-api';
import { detectConflicts, resolveConflicts } from '@/lib/evoguard/conflict-detector';
import { db } from '@/lib/db';

// ---- Shared helpers ----

function verifySignature(rawBody: string, req: NextRequest): { ok: false; error: string } | { ok: true } {
  const signature = req.headers.get('x-hub-signature-256');
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return { ok: false, error: 'Webhook secret not configured' };
  if (!verifyWebhookSignature(rawBody, signature, secret)) return { ok: false, error: 'Invalid signature' };
  return { ok: true };
}

function parseBody(rawBody: string): { ok: true; data: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, data: JSON.parse(rawBody) };
  } catch {
    return { ok: false, error: 'Invalid JSON' };
  }
}

function buildStampComment(
  decisionId: string, timestamp: string, prNumber: number,
  mergeSha: string, authorLogin: string, evidenceCount: number,
): string {
  const bt = '`';
  const code = bt + bt + bt;
  return [
    '## ⚡ EvoGuard Decision ID Stamp',
    '',
    '| Field | Value |',
    '|-------|-------|',
    `| **Decision ID** | ${code}${decisionId}${code} |`,
    `| **Timestamp** | ${timestamp} |`,
    `| **PR** | #${prNumber} |`,
    `| **Merge Commit** | ${code}${mergeSha}${code} |`,
    `| **Author** | @${authorLogin} |`,
    `| **Evidence Snapshots** | ${evidenceCount} |`,
  ].join('\n');
}

// ---- POST: Main webhook handler ----

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const sig = verifySignature(rawBody, req);
  if (!sig.ok) {
    return NextResponse.json({ error: sig.error }, { status: sig.error === 'Invalid signature' ? 401 : 500 });
  }

  const body = parseBody(rawBody);
  if (!body.ok) {
    return NextResponse.json({ error: body.error }, { status: 400 });
  }

  if (isMergedPrEvent(body.data)) return handleMergedPr(body.data);
  if (isEvidencePrEvent(body.data)) return handleEvidenceCollection(body.data);

  return NextResponse.json({ message: 'Event ignored' });
}

// ---- Evidence + Conflict detection (opened / synchronize / reopened) ----

async function handleEvidenceCollection(event: PullRequestEvidenceEvent) {
  const pr = event.pull_request;
  const repoFullName = event.repository.full_name;
  const headSha = pr.head.sha;
  const githubToken = process.env.GITHUB_TOKEN;

  console.log(`[EvoGuard] Evidence + Context check: PR #${pr.number} (${event.action}) in ${repoFullName}`);

  let evidenceData;
  if (githubToken) {
    try {
      const [owner, repo] = repoFullName.split('/');
      evidenceData = await collectEvidence({ token: githubToken, owner, repo, prNumber: pr.number, headSha });

      // Run conflict detection against other open PRs
      try {
        const conflicts = await detectConflicts({
          token: githubToken, owner, repo,
          triggerPrNumber: pr.number,
          triggerPrFiles: evidenceData.changedFiles,
        });
        if (conflicts.length > 0) {
          console.log(`[EvoGuard] Detected ${conflicts.length} conflict(s) for PR #${pr.number}`);
        }
      } catch (err) {
        console.error('[EvoGuard] Conflict detection failed:', err);
      }
    } catch (err) {
      console.error('[EvoGuard] Evidence collection failed:', err);
      return NextResponse.json({ error: 'Evidence collection failed' }, { status: 500 });
    }
  } else {
    evidenceData = { changedFiles: [], diffStats: { additions: 0, deletions: 0, changedFiles: 0 }, reviewComments: [], checkStatuses: [] };
  }

  await db.evidenceSnapshot.create({
    data: {
      prNumber: pr.number, repoFullName, headSha,
      evidenceType: `PR_${event.action.toUpperCase()}`,
      changedFiles: JSON.stringify(evidenceData.changedFiles),
      diffStats: JSON.stringify(evidenceData.diffStats),
      reviewComments: JSON.stringify(evidenceData.reviewComments),
      checkStatuses: JSON.stringify(evidenceData.checkStatuses),
      prTitle: pr.title, prBody: pr.body,
    },
  });

  console.log(`[EvoGuard] Evidence snapshot saved for PR #${pr.number}`);
  return NextResponse.json({ message: 'Evidence collected', prNumber: pr.number, headSha });
}

// ---- Merge handler: stamp Decision ID + resolve conflicts ----

async function handleMergedPr(event: PullRequestMergedEvent) {
  const pr = event.pull_request;
  const repoFullName = event.repository.full_name;
  const mergeSha = pr.merge_commit_sha!;

  console.log(`[EvoGuard] PR #${pr.number} merged in ${repoFullName}, SHA: ${mergeSha}`);

  const decisionId = generateDecisionId();
  const parsedId = parseDecisionId(decisionId);
  const timestamp = new Date(parsedId.timestamp);
  console.log(`[EvoGuard] Generated Decision ID: ${decisionId} (ts: ${timestamp.toISOString()})`);

  const githubToken = process.env.GITHUB_TOKEN;
  const [owner, repo] = repoFullName.split('/');

  // Collect pre-merge evidence
  let evidenceCount = 0;
  if (githubToken) {
    try {
      const evidenceData = await collectEvidence({ token: githubToken, owner, repo, prNumber: pr.number, headSha: mergeSha });
      await db.evidenceSnapshot.create({
        data: {
          prNumber: pr.number, repoFullName, headSha: mergeSha,
          evidenceType: 'PRE_MERGE',
          changedFiles: JSON.stringify(evidenceData.changedFiles),
          diffStats: JSON.stringify(evidenceData.diffStats),
          reviewComments: JSON.stringify(evidenceData.reviewComments),
          checkStatuses: JSON.stringify(evidenceData.checkStatuses),
          prTitle: pr.title, prBody: pr.body,
        },
      });
      evidenceCount = 1;
    } catch (err) {
      console.error('[EvoGuard] Pre-merge evidence collection failed:', err);
    }
  }

  // Resolve any conflicts involving this PR
  try {
    await resolveConflicts({ repoFullName, prNumber: pr.number, resolution: 'merged_b' });
    console.log(`[EvoGuard] Resolved conflicts for merged PR #${pr.number}`);
  } catch (err) {
    console.error('[EvoGuard] Conflict resolution failed:', err);
  }

  const existingSnapshots = await db.evidenceSnapshot.count({ where: { prNumber: pr.number, repoFullName } });
  evidenceCount += existingSnapshots;

  // Stamp Decision ID
  const stampComment = buildStampComment(decisionId, timestamp.toISOString(), pr.number, mergeSha, pr.user.login, evidenceCount);
  const statusDescription = `Decision ID: ${decisionId.slice(0, 8)}...`;

  try {
    if (githubToken) {
      await createPullRequestComment({ token: githubToken, owner, repo, prNumber: pr.number, body: stampComment });
      console.log(`[EvoGuard] Comment posted to PR #${pr.number}`);
      await createCommitStatus({ token: githubToken, owner, repo, sha: mergeSha, state: 'success', description: statusDescription });
      console.log(`[EvoGuard] Commit status created for ${mergeSha}`);
    }
  } catch (err) {
    console.error('[EvoGuard] GitHub API error:', err);
  }

  await db.decisionRecord.create({
    data: {
      decisionId, prNumber: pr.number, repoFullName, mergeCommitSha: mergeSha,
      author: pr.user.login, prTitle: pr.title, prBody: pr.body,
    },
  });

  console.log(`[EvoGuard] DecisionRecord persisted: ${decisionId}`);
  return NextResponse.json({ message: 'Decision ID stamped', decisionId, prNumber: pr.number, mergeCommitSha: mergeSha, evidenceSnapshots: evidenceCount });
}
