const GITHUB_API = 'https://api.github.com';

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
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state,
        description,
        context,
        target_url: targetUrl,
      }),
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
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API comment creation failed: ${res.status} - ${text}`);
  }

  return res.json() as Promise<Record<string, unknown>>;
}
