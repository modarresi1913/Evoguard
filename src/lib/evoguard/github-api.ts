const GITHUB_API = 'https://api.github.com';

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

// ---- Decision ID stamping ----

export async function createCommitStatus({
  token,
  owner,
  repo,
  sha,
  state,
  description,
  context = 'evoguard/decision-id',
  targetUrl,
}: {
  token: string;
  owner: string;
  repo: string;
  sha: string;
  state: 'success' | 'error' | 'failure' | 'pending';
  description: string;
  context?: string;
  targetUrl?: string;
}) {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/statuses/${sha}`,
    {
      method: 'POST',
      headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ state, description, context, target_url: targetUrl }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API status creation failed: ${res.status} - ${text}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

export async function createPullRequestComment({
  token,
  owner,
  repo,
  prNumber,
  body,
}: {
  token: string;
  owner: string;
  repo: string;
  prNumber: number;
  body: string;
}) {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/issues/${prNumber}/comments`,
    {
      method: 'POST',
      headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API comment creation failed: ${res.status} - ${text}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

// ---- Evidence collection APIs ----

export interface ChangedFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
}

export interface ReviewComment {
  id: number;
  author: string;
  body: string;
  path: string;
  line: number | null;
  createdAt: string;
}

export interface CheckStatus {
  name: string;
  status: string;
  conclusion: string | null;
}

export interface EvidenceData {
  changedFiles: ChangedFile[];
  diffStats: { additions: number; deletions: number; changedFiles: number };
  reviewComments: ReviewComment[];
  checkStatuses: CheckStatus[];
}

export async function fetchChangedFiles({
  token, owner, repo, prNumber,
}: {
  token: string; owner: string; repo: string; prNumber: number;
}): Promise<ChangedFile[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/files`,
    { headers: ghHeaders(token) }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch PR files: ${res.status} - ${text}`);
  }
  const data = (await res.json()) as Array<Record<string, unknown>>;
  return data.map((f) => ({
    filename: String(f.filename),
    status: String(f.status),
    additions: Number(f.additions),
    deletions: Number(f.deletions),
    changes: Number(f.changes),
  }));
}

export async function fetchReviewComments({
  token, owner, repo, prNumber,
}: {
  token: string; owner: string; repo: string; prNumber: number;
}): Promise<ReviewComment[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/comments`,
    { headers: ghHeaders(token) }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch review comments: ${res.status} - ${text}`);
  }
  const data = (await res.json()) as Array<Record<string, unknown>>;
  return data.map((c) => ({
    id: Number(c.id),
    author: String((c.user as Record<string, unknown>)?.login ?? 'unknown'),
    body: String(c.body ?? ''),
    path: String(c.path),
    line: c.line !== null ? Number(c.line) : null,
    createdAt: String(c.created_at),
  }));
}

export async function fetchCheckStatuses({
  token, owner, repo, ref,
}: {
  token: string; owner: string; repo: string; ref: string;
}): Promise<CheckStatus[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/commits/${ref}/check-runs`,
    { headers: ghHeaders(token) }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch check runs: ${res.status} - ${text}`);
  }
  const data = (await res.json()) as Record<string, unknown>;
  const runs = (data.check_runs ?? []) as Array<Record<string, unknown>>;
  return runs.map((r) => ({
    name: String(r.name),
    status: String(r.status),
    conclusion: r.conclusion !== null ? String(r.conclusion) : null,
  }));
}

export async function collectEvidence(params: {
  token: string; owner: string; repo: string; prNumber: number; headSha: string;
}): Promise<EvidenceData> {
  const [changedFiles, reviewComments, checkStatuses] = await Promise.allSettled([
    fetchChangedFiles(params),
    fetchReviewComments(params),
    fetchCheckStatuses({ token: params.token, owner: params.owner, repo: params.repo, ref: params.headSha }),
  ]);
  const files = changedFiles.status === 'fulfilled' ? changedFiles.value : [];
  const reviews = reviewComments.status === 'fulfilled' ? reviewComments.value : [];
  const checks = checkStatuses.status === 'fulfilled' ? checkStatuses.value : [];
  const diffStats = {
    additions: files.reduce((s, f) => s + f.additions, 0),
    deletions: files.reduce((s, f) => s + f.deletions, 0),
    changedFiles: files.length,
  };
  return { changedFiles: files, diffStats, reviewComments: reviews, checkStatuses: checks };
}

// ---- Context: Open PR listing & conflict detection ----

export interface OpenPR {
  number: number;
  title: string;
  author: string;
  headSha: string;
  changedFiles: ChangedFile[];
}

export async function fetchOpenPRs({
  token, owner, repo,
}: {
  token: string; owner: string; repo: string;
}): Promise<Array<{ number: number; title: string; author: string; headSha: string }>> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls?state=open&per_page=100`,
    { headers: ghHeaders(token) }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch open PRs: ${res.status} - ${text}`);
  }
  const data = (await res.json()) as Array<Record<string, unknown>>;
  return data.map((pr) => ({
    number: Number(pr.number),
    title: String(pr.title),
    author: String((pr.user as Record<string, unknown>)?.login ?? 'unknown'),
    headSha: String((pr.head as Record<string, unknown>)?.sha ?? ''),
  }));
}
