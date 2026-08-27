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

export interface PullRequestMergedEvent {
  action: string;
  number: number;
  pull_request: {
    number: number;
    title: string;
    body: string | null;
    merge_commit_sha: string | null;
    head: {
      sha: string;
      ref: string;
    };
    base: {
      repo: {
        full_name: string;
        name: string;
        owner: {
          login: string;
        };
      };
      ref: string;
    };
    user: {
      login: string;
    };
    merged: boolean;
    merged_at: string | null;
    merged_by: {
      login: string;
    } | null;
  };
  repository: {
    full_name: string;
    name: string;
    owner: {
      login: string;
    };
  };
  sender: {
    login: string;
  };
}

export function isMergedPrEvent(
  body: unknown
): body is PullRequestMergedEvent {
  const evt = body as Record<string, unknown>;
  return (
    evt?.action === 'closed' &&
    (evt?.pull_request as Record<string, unknown>)?.merged === true &&
    typeof (evt?.pull_request as Record<string, unknown>)?.merge_commit_sha === 'string' &&
    typeof (evt?.pull_request as Record<string, unknown>)?.number === 'number'
  );
}
