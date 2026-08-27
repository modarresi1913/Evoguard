import crypto from 'crypto';

export function verifyWebhookSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;

  const parts = signatureHeader.split('=');
  if (parts.length !== 2 || parts[0] !== 'sha256') return false;

  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader),
    Buffer.from(expected)
  );
}

// ---- Shared PR shape ----
interface PrBase {
  number: number;
  title: string;
  body: string | null;
  head: { sha: string; ref: string };
  base: {
    repo: { full_name: string; name: string; owner: { login: string } };
    ref: string;
  };
  user: { login: string };
}

// ---- Merged PR event (action=closed, merged=true) ----
export interface PullRequestMergedEvent {
  action: string;
  number: number;
  pull_request: PrBase & {
    merge_commit_sha: string | null;
    merged: boolean;
    merged_at: string | null;
    merged_by: { login: string } | null;
  };
  repository: { full_name: string; name: string; owner: { login: string } };
  sender: { login: string };
}

// ---- Evidence-eligible PR events (opened / synchronize / reopened) ----
export interface PullRequestEvidenceEvent {
  action: 'opened' | 'synchronize' | 'reopened';
  number: number;
  pull_request: PrBase;
  repository: { full_name: string; name: string; owner: { login: string } };
  sender: { login: string };
}

export function isMergedPrEvent(
  body: unknown
): body is PullRequestMergedEvent {
  const evt = body as Record<string, unknown>;
  const pr = evt?.pull_request as Record<string, unknown> | undefined;
  return (
    evt?.action === 'closed' &&
    pr?.merged === true &&
    typeof pr?.merge_commit_sha === 'string' &&
    typeof pr?.number === 'number'
  );
}

export function isEvidencePrEvent(
  body: unknown
): body is PullRequestEvidenceEvent {
  const evt = body as Record<string, unknown>;
  const pr = evt?.pull_request as Record<string, unknown> | undefined;
  const validActions = ['opened', 'synchronize', 'reopened'];
  return (
    typeof evt?.action === 'string' &&
    validActions.includes(evt.action) &&
    typeof pr?.number === 'number' &&
    typeof pr?.head?.sha === 'string'
  );
}
