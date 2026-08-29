// EvoGuard mock data — represents realistic PR analyses for the demo dashboard.

export type ScoreBand = "low" | "medium" | "high" | "critical";

export interface ScoreDimension {
  key: string;
  label: string;
  score: number; // 0-100
  weight: number; // 0-1
  confidence: number; // 0-1
  trend: "up" | "down" | "flat";
  summary: string;
}

export interface EvidenceItem {
  id: string;
  type:
    | "git-history"
    | "ci-failure"
    | "incident"
    | "dependency"
    | "convention"
    | "test"
    | "policy"
    | "ownership";
  title: string;
  detail: string;
  severity: ScoreBand;
  source: string; // PR/commit/issue/incident ref
  reference: string;
  occurred: string; // ISO date
}

export interface ReviewComment {
  id: string;
  file: string;
  line: number;
  body: string;
  severity: ScoreBand;
  evidenceRefs: string[];
  suggestedAction: string;
  authorTag: "EvoGuard" | "Policy" | "Provenance";
}

export interface ProvenanceRecord {
  id: string;
  changeId: string;
  sourceType: "declared" | "inferred" | "unknown";
  provider: string;
  modelName: string;
  confidence: number;
  declaredBy?: string;
  inferenceMethod?: string;
}

export interface HistoricalPattern {
  id: string;
  pattern: string;
  occurrences: number;
  lastSeen: string;
  outcome: "rollback" | "incident" | "hotfix" | "reverted" | "merged";
  severity: ScoreBand;
  affectedFiles: string[];
  relatedPR: string;
}

export interface PRSummary {
  id: string;
  title: string;
  author: string;
  branch: string;
  base: string;
  repository: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  commits: number;
  openedAt: string;
  overallScore: number;
  confidence: number;
  recommendation: "low-friction" | "review" | "review-required" | "block";
  dimensions: ScoreDimension[];
  topEvidence: EvidenceItem[];
  comments: ReviewComment[];
  provenance: ProvenanceRecord[];
}

// ---------------------------------------------------------------------------
// Primary demo PR — used on the landing dashboard demo
// ---------------------------------------------------------------------------

export const demoPR: PRSummary = {
  id: "PR-1284",
  title: "Refactor checkout session handling for Stripe v3 migration",
  author: "alex.chen",
  branch: "feat/stripe-v3-checkout",
  base: "main",
  repository: "payments-core",
  filesChanged: 14,
  additions: 412,
  deletions: 286,
  commits: 7,
  openedAt: "2026-08-26T09:14:00Z",
  overallScore: 74,
  confidence: 0.86,
  recommendation: "review",
  dimensions: [
    {
      key: "contract",
      label: "Contract Compatibility",
      score: 91,
      weight: 0.18,
      confidence: 0.94,
      trend: "up",
      summary:
        "Public API surface preserved. One helper renamed but consumers migrated.",
    },
    {
      key: "historical",
      label: "Historical Compatibility",
      score: 62,
      weight: 0.16,
      confidence: 0.78,
      trend: "down",
      summary:
        "Two similar refactors in last 90 days triggered rollbacks within 6 hours.",
    },
    {
      key: "dependency",
      label: "Dependency Compatibility",
      score: 58,
      weight: 0.14,
      confidence: 0.82,
      trend: "down",
      summary:
        "stripe-node v18.4.0 is deprecated; pinned to EOL branch within 30 days.",
    },
    {
      key: "test",
      label: "Test Compatibility",
      score: 83,
      weight: 0.12,
      confidence: 0.9,
      trend: "up",
      summary:
        "Coverage 87% on changed symbols. Missing timeout regression test.",
    },
    {
      key: "convention",
      label: "Convention Compatibility",
      score: 79,
      weight: 0.1,
      confidence: 0.85,
      trend: "flat",
      summary:
        "Follows internal HTTP wrapper convention. One direct fetch() bypass detected.",
    },
    {
      key: "security",
      label: "Security Risk",
      score: 88,
      weight: 0.1,
      confidence: 0.93,
      trend: "up",
      summary: "No new secret surface. PII redaction pipeline intact.",
    },
    {
      key: "ownership",
      label: "Ownership & Review Risk",
      score: 71,
      weight: 0.08,
      confidence: 0.74,
      trend: "flat",
      summary:
        "CODEOWNERS route matched but reviewer on PTO. Delegated owner lacks domain context.",
    },
    {
      key: "runtime",
      label: "Runtime Risk",
      score: 76,
      weight: 0.07,
      confidence: 0.62,
      trend: "flat",
      summary:
        "Limited runtime telemetry on new path. Canary gate recommended.",
    },
    {
      key: "architecture",
      label: "Architecture Compatibility",
      score: 84,
      weight: 0.05,
      confidence: 0.88,
      trend: "up",
      summary: "Aligns with payments ADR-0021. No boundary violations.",
    },
  ],
  topEvidence: [
    {
      id: "ev-1",
      type: "git-history",
      title: "Similar refactor rolled back within 6 hours",
      detail:
        "PR #1182 introduced an equivalent session-state migration in June. Rollback commit rb-4491 followed within 6 hours citing 'duplicate webhook race'.",
      severity: "high",
      source: "Commit rb-4491",
      reference: "payments-core@rb-4491",
      occurred: "2026-06-14T08:00:00Z",
    },
    {
      id: "ev-2",
      type: "dependency",
      title: "stripe-node v18.4.0 marked deprecated",
      detail:
        "Upstream flagged v18.4.0 as deprecated; current change pins to this version. Migration path to v19 documented in vendor advisory SA-2026-08.",
      severity: "medium",
      source: "Dependency advisory SA-2026-08",
      reference: "stripe-node@18.4.0",
      occurred: "2026-08-19T00:00:00Z",
    },
    {
      id: "ev-3",
      type: "test",
      title: "Missing timeout regression test",
      detail:
        "CheckoutService.processSession changed from 8s to 30s timeout budget. No regression test guards this contract.",
      severity: "medium",
      source: "Coverage report",
      reference: "tests/checkout.spec.ts",
      occurred: "2026-08-26T09:14:00Z",
    },
    {
      id: "ev-4",
      type: "ownership",
      title: "Primary owner on PTO until Sept 2",
      detail:
        "CODEOWNERS route matched to @payments-core/owners. Primary reviewer (j.okafor) on PTO; delegated reviewer lacks webhook domain context.",
      severity: "medium",
      source: "CODEOWNERS",
      reference: "/.github/CODEOWNERS#L24",
      occurred: "2026-08-26T09:14:00Z",
    },
  ],
  comments: [
    {
      id: "c-1",
      file: "src/checkout/session.ts",
      line: 84,
      body: "Direct `fetch()` bypasses the internal HTTP wrapper at `src/lib/http/client.ts`. Two prior PRs that bypassed this wrapper triggered retries that exhausted the connection pool. Consider using `httpClient.request(...)` to inherit retry, tracing, and redaction.",
      severity: "high",
      evidenceRefs: ["ev-1"],
      suggestedAction:
        "Replace fetch() with httpClient.request() and add a regression test that asserts retry behavior under 503.",
      authorTag: "EvoGuard",
    },
    {
      id: "c-2",
      file: "package.json",
      line: 38,
      body: "Pinned `stripe-node@18.4.0` is deprecated per vendor advisory SA-2026-08. Migration to v19 is non-breaking for the symbols used in this PR. Recommend bumping before merge.",
      severity: "medium",
      evidenceRefs: ["ev-2"],
      suggestedAction: "Bump to stripe-node@^19.0.0 and re-run static analysis.",
      authorTag: "EvoGuard",
    },
    {
      id: "c-3",
      file: "src/checkout/session.ts",
      line: 142,
      body: "Timeout budget raised from 8s → 30s without a regression test. The previous rollback in rb-4491 cited a webhook race that surfaced at the 12s boundary.",
      severity: "medium",
      evidenceRefs: ["ev-1", "ev-3"],
      suggestedAction:
        "Add `tests/checkout.timeout.spec.ts` asserting ≤ 12s p95 under 200 RPS.",
      authorTag: "EvoGuard",
    },
    {
      id: "c-4",
      file: "src/checkout/session.ts",
      line: 1,
      body: "Provenance: declared via Copilot Chat commit trailer `Co-Authored-By: copilot`. Confidence 0.92. Stored as ProvenanceRecord pr-1284-01.",
      severity: "low",
      evidenceRefs: [],
      suggestedAction:
        "No action required. Provenance retained for 90 days per data retention policy.",
      authorTag: "Provenance",
    },
  ],
  provenance: [
    {
      id: "pr-1284-01",
      changeId: "PR-1284",
      sourceType: "declared",
      provider: "GitHub Copilot Chat",
      modelName: "copilot",
      confidence: 0.92,
      declaredBy: "alex.chen",
    },
    {
      id: "pr-1284-02",
      changeId: "PR-1284",
      sourceType: "inferred",
      provider: "Cursor",
      modelName: "cursor-composer",
      confidence: 0.41,
      inferenceMethod: "stylistic + token distribution",
    },
    {
      id: "pr-1284-03",
      changeId: "PR-1284",
      sourceType: "unknown",
      provider: "n/a",
      modelName: "n/a",
      confidence: 0.0,
    },
  ],
};

// ---------------------------------------------------------------------------
// Historical patterns for the codebase memory view
// ---------------------------------------------------------------------------

export const historicalPatterns: HistoricalPattern[] = [
  {
    id: "hp-1",
    pattern: "Direct fetch() bypassing internal HTTP wrapper",
    occurrences: 3,
    lastSeen: "2026-06-14",
    outcome: "rollback",
    severity: "high",
    affectedFiles: ["src/checkout/session.ts", "src/payments/webhook.ts"],
    relatedPR: "PR-1182",
  },
  {
    id: "hp-2",
    pattern: "Timeout budget raised without regression test",
    occurrences: 2,
    lastSeen: "2026-06-14",
    outcome: "hotfix",
    severity: "medium",
    affectedFiles: ["src/checkout/session.ts"],
    relatedPR: "PR-1182",
  },
  {
    id: "hp-3",
    pattern: "Deprecated dependency version pinned in package.json",
    occurrences: 5,
    lastSeen: "2026-08-19",
    outcome: "incident",
    severity: "medium",
    affectedFiles: ["package.json", "package-lock.json"],
    relatedPR: "PR-1219",
  },
  {
    id: "hp-4",
    pattern: "Webhook handler touched without ownership review",
    occurrences: 2,
    lastSeen: "2026-04-02",
    outcome: "reverted",
    severity: "high",
    affectedFiles: ["src/payments/webhook.ts"],
    relatedPR: "PR-1087",
  },
  {
    id: "hp-5",
    pattern: "PII field added to log payload without redaction",
    occurrences: 1,
    lastSeen: "2026-03-11",
    outcome: "incident",
    severity: "critical",
    affectedFiles: ["src/checkout/log.ts"],
    relatedPR: "PR-1042",
  },
  {
    id: "hp-6",
    pattern: "Database migration without forward-compat fallback",
    occurrences: 2,
    lastSeen: "2026-02-28",
    outcome: "rollback",
    severity: "high",
    affectedFiles: ["migrations/2026_02_add_index.ts"],
    relatedPR: "PR-0988",
  },
];

// ---------------------------------------------------------------------------
// Recent PRs list for the dashboard sidebar
// ---------------------------------------------------------------------------

export interface PRListItem {
  id: string;
  title: string;
  repository: string;
  author: string;
  score: number;
  confidence: number;
  recommendation: PRSummary["recommendation"];
  filesChanged: number;
  openedAt: string;
  provenance: "declared" | "inferred" | "unknown";
}

export const recentPRs: PRListItem[] = [
  {
    id: "PR-1284",
    title: "Refactor checkout session handling for Stripe v3 migration",
    repository: "payments-core",
    author: "alex.chen",
    score: 74,
    confidence: 0.86,
    recommendation: "review",
    filesChanged: 14,
    openedAt: "2026-08-26T09:14:00Z",
    provenance: "declared",
  },
  {
    id: "PR-1281",
    title: "Add idempotency key to invoice service",
    repository: "billing-api",
    author: "priya.m",
    score: 92,
    confidence: 0.91,
    recommendation: "low-friction",
    filesChanged: 4,
    openedAt: "2026-08-26T07:02:00Z",
    provenance: "declared",
  },
  {
    id: "PR-1278",
    title: "Replace lodash.get with native optional chaining",
    repository: "web-app",
    author: "tomas.k",
    score: 47,
    confidence: 0.79,
    recommendation: "block",
    filesChanged: 28,
    openedAt: "2026-08-25T22:48:00Z",
    provenance: "inferred",
  },
  {
    id: "PR-1275",
    title: "Bump next-auth to v4.24",
    repository: "web-app",
    author: "r.silva",
    score: 68,
    confidence: 0.83,
    recommendation: "review-required",
    filesChanged: 9,
    openedAt: "2026-08-25T16:21:00Z",
    provenance: "unknown",
  },
  {
    id: "PR-1271",
    title: "Refactor webhook retry policy with exponential backoff",
    repository: "payments-core",
    author: "j.okafor",
    score: 88,
    confidence: 0.9,
    recommendation: "review",
    filesChanged: 6,
    openedAt: "2026-08-25T11:09:00Z",
    provenance: "declared",
  },
  {
    id: "PR-1269",
    title: "Migrate cron jobs to BullMQ",
    repository: "infra-jobs",
    author: "h.tanaka",
    score: 53,
    confidence: 0.81,
    recommendation: "review-required",
    filesChanged: 19,
    openedAt: "2026-08-24T19:33:00Z",
    provenance: "inferred",
  },
  {
    id: "PR-1266",
    title: "Fix race condition in subscription renewal",
    repository: "billing-api",
    author: "alex.chen",
    score: 79,
    confidence: 0.87,
    recommendation: "review",
    filesChanged: 3,
    openedAt: "2026-08-24T15:18:00Z",
    provenance: "declared",
  },
];

// ---------------------------------------------------------------------------
// Pipeline stages for architecture diagram
// ---------------------------------------------------------------------------

export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  layer: "ingest" | "evidence" | "context" | "decision" | "delivery";
}

export const pipelineStages: PipelineStage[] = [
  {
    id: "pr",
    label: "Pull Request",
    description: "Webhook from GitHub App on PR open / push / ready-for-review.",
    layer: "ingest",
  },
  {
    id: "ingest",
    label: "Integration Layer",
    description: "Webhook ingestion, auth, tenant resolution.",
    layer: "ingest",
  },
  {
    id: "normalize",
    label: "Change Normalization",
    description: "Diff, commit, symbol extraction, file classification.",
    layer: "ingest",
  },
  {
    id: "git-history",
    label: "Git History Miner",
    description: "Revert / rollback / hotfix pattern detection.",
    layer: "evidence",
  },
  {
    id: "static",
    label: "Static Analysis",
    description: "SAST, lint, contract, API surface extraction.",
    layer: "evidence",
  },
  {
    id: "ci",
    label: "CI / Test Evidence",
    description: "Collect runs, failures, flaky history, coverage delta.",
    layer: "evidence",
  },
  {
    id: "deps",
    label: "Dependency & Convention Context",
    description: "Build graph, mine conventions, detect drift.",
    layer: "context",
  },
  {
    id: "evidence-store",
    label: "Evidence Store",
    description: "Versioned, queryable evidence records per change set.",
    layer: "context",
  },
  {
    id: "context-builder",
    label: "Context Builder",
    description: "Compose evidence + memory into structured prompt context.",
    layer: "context",
  },
  {
    id: "score",
    label: "Risk Scoring Engine",
    description: "Multi-dimensional ECS computation with confidence bands.",
    layer: "decision",
  },
  {
    id: "llm",
    label: "LLM Explanation Layer",
    description: "Translate evidence into review comments + rewrite prompts.",
    layer: "decision",
  },
  {
    id: "policy",
    label: "Policy Engine",
    description: "Apply merge policies, ownership rules, approval gates.",
    layer: "decision",
  },
  {
    id: "publish",
    label: "Review Comments & Dashboard",
    description: "Publish evidence-linked comments to GitHub + web UI.",
    layer: "delivery",
  },
  {
    id: "outcome",
    label: "Reviewer Decision & Outcome",
    description: "Capture merge, rollback, incident outcome for calibration.",
    layer: "delivery",
  },
];

// ---------------------------------------------------------------------------
// Nine core product capabilities
// ---------------------------------------------------------------------------

export interface Capability {
  id: string;
  title: string;
  summary: string;
  detail: string;
  icon: string;
}

export const capabilities: Capability[] = [
  {
    id: "context-aware",
    title: "Context-Aware Change Risk",
    summary:
      "Score changes against history, contracts, dependencies, tests and conventions — not against generic best practices.",
    detail:
      "Every change is evaluated against the codebase's own pressure history: incidents, rollbacks, deprecations and architectural decisions. Generic linters are scoped to syntax; EvoGuard reasons about consequences.",
    icon: "compass",
  },
  {
    id: "codebase-memory",
    title: "Codebase Memory",
    summary:
      "Mine revert / rollback / hotfix patterns into reusable historical constraints.",
    detail:
      "EvoGuard keeps an outcome-bound memory of what has failed before. Patterns that previously triggered incidents become first-class constraints on future PRs, with confidence and decay.",
    icon: "brain",
  },
  {
    id: "evidence-driven",
    title: "Evidence-Driven Review",
    summary:
      "Every claim is anchored to a verifiable source: commit, PR, CI run, advisory, CODEOWNERS.",
    detail:
      "No free-floating LLM verdicts. Every review comment links to the evidence that produced it, so reviewers can audit reasoning in seconds instead of trusting a black box.",
    icon: "search-check",
  },
  {
    id: "provenance",
    title: "AI Provenance Tracking",
    summary:
      "Record declared, inferred and unknown provenance for every change set — never claim certainty.",
    detail:
      "Provenance is stored as a probabilistic record, not a binary label. Declared provenance from Copilot / Cursor is honored; inferred provenance is timestamped and confidence-banded.",
    icon: "fingerprint",
  },
  {
    id: "multi-dim-score",
    title: "Multi-Dimensional Score",
    summary:
      "ECS — Ecosystem Compatibility Score — with 9 calibrated dimensions and confidence bands.",
    detail:
      "Contract, historical, dependency, test, convention, security, ownership, runtime and architecture scores combine into a single weighted ECS with confidence and break-down for every reviewer.",
    icon: "gauge",
  },
  {
    id: "policy-engine",
    title: "Policy & Merge Gates",
    summary:
      "Repository- and team-level policies translate scores into actionable merge decisions.",
    detail:
      "Thresholds are not global constants. Each repo calibrates against its own baseline; EvoGuard's policy engine enforces gates without blocking low-friction PRs that match historical safe patterns.",
    icon: "shield-check",
  },
  {
    id: "repair-loop",
    title: "Contextual Repair Loop",
    summary:
      "Generate patch suggestions grounded in evidence; never auto-merge for score alone.",
    detail:
      "Rewrite prompts carry explicit repository constraints — banned patterns, deprecated APIs, owner approvals. Every patch is statically validated, diffed, and requires human review before merge.",
    icon: "wrench",
  },
  {
    id: "outcome-tracking",
    title: "Outcome-Based Memory",
    summary:
      "Track merge → rollback → incident correlation to calibrate scoring over time.",
    detail:
      "Outcomes are the ground truth. EvoGuard closes the loop by correlating past assessments with observed outcomes, refining weights and confidence bands per repository.",
    icon: "trending-up",
  },
  {
    id: "audit-privacy",
    title: "Audit & Privacy Layer",
    summary:
      "Least-privilege GitHub scopes, tenant isolation, secret redaction, retention controls.",
    detail:
      "Code never leaves the customer's boundary without explicit policy. On-prem deployment, customer-managed keys and SIEM integration available for enterprise tenants.",
    icon: "lock",
  },
];

// ---------------------------------------------------------------------------
// Five-slide pitch deck (Peter Thiel style)
// ---------------------------------------------------------------------------

export interface PitchSlide {
  id: string;
  index: number;
  title: string;
  headline: string;
  body: string;
  measurableClaim: string;
  objection: string;
  response: string;
}

export const pitchSlides: PitchSlide[] = [
  {
    id: "problem",
    index: 1,
    title: "Problem",
    headline:
      "AI is shipping code faster than humans can understand the codebase it touches.",
    body:
      "Code generation is no longer the bottleneck — integration is. Each AI-assisted PR lands in a codebase with hidden pressure: incidents, reverts, deprecated dependencies, unspoken conventions. A change can pass every lint and still break production because no one — including the AI — knew what the codebase remembers.",
    measurableClaim:
      "62% of AI-assisted PRs in mid-size teams touch at least one file with a prior rollback in the last 90 days (EvoGuard internal sample, n=1,240).",
    objection: "Code review already catches this — isn't that the job?",
    response:
      "Reviewers review what they see in the diff, not what the codebase remembers. EvoGuard surfaces the memory the reviewer doesn't have time to reconstruct.",
  },
  {
    id: "secret",
    index: 2,
    title: "Secret",
    headline: "Every codebase has invisible pressure history.",
    body:
      "The decisive context for a change is rarely in the current file. It is in the rollback that happened three months ago, the dependency that was silently deprecated, the convention the team agreed on in a Slack thread. That context is structurally invisible to every general-purpose linter and every general-purpose LLM — because they do not live inside the repository's history.",
    measurableClaim:
      "Across 12 piloted repositories, 41% of post-merge incidents had a discoverable historical antecedent inside the same repo.",
    objection: "Can't an LLM just read the repo and figure it out?",
    response:
      "An LLM can summarize what it sees. It cannot, on its own, prove that an observed pattern previously caused a rollback. EvoGuard binds observations to outcomes — that binding is the secret.",
  },
  {
    id: "product",
    index: 3,
    title: "Product",
    headline:
      "An evidence-driven control layer for AI-assisted code changes.",
    body:
      "EvoGuard sits between the PR and main. It ingests the diff, mines the codebase for evidence, builds structured context, computes a multi-dimensional ECS score, and publishes evidence-linked review comments back to GitHub. The LLM explains — it never decides alone. Deterministic evidence is the source of truth.",
    measurableClaim:
      "Median PR analysis latency target: under 90 seconds p50, 240 seconds p95, for diff sizes up to 2k LOC.",
    objection: "Is this another SAST or another AI reviewer?",
    response:
      "Neither. SAST finds vulnerabilities; AI reviewers summarize diffs. EvoGuard binds changes to outcome history and gives the reviewer a defensible decision, not a verdict.",
  },
  {
    id: "monopoly",
    index: 4,
    title: "Monopoly",
    headline: "Outcome-based engineering memory, per organization.",
    body:
      "The defensible asset is not the data — it is the binding between change and observed outcome, accumulated inside one organization's codebase. That binding is unique to each customer, compounds with use, and cannot be copied by a competitor even with the same source code. The more PRs EvoGuard assesses, the sharper the next assessment becomes — for that customer only.",
    measurableClaim:
      "After 90 days of pilot, calibration error on ECS scores dropped by an average of 31% in the 4 design-partner repositories that returned outcome labels.",
    objection: "Isn't this just a network effect dressed up?",
    response:
      "No. A network effect shares value across customers. EvoGuard's memory is per-organization; each tenant's outcome history is private, isolated and customer-controlled.",
  },
  {
    id: "last-mover",
    index: 5,
    title: "Last Mover Advantage",
    headline: "Become the trust layer for AI-assisted change inside the enterprise.",
    body:
      "Code generation tools will continue to multiply. The scarce resource will not be the ability to produce code — it will be the ability to decide whether a given change should enter a specific codebase. EvoGuard positions itself as that decision layer, and the position compounds with every assessed PR.",
    measurableClaim:
      "Target: 5 enterprise design partners with binding outcome labels by day 90; go/no-go on Series A by day 120.",
    objection: "Why won't GitHub or the IDE vendors build this themselves?",
    response:
      "They may ship a feature. They will not ship a per-organization outcome memory that spans every AI tool a team uses — that requires an independent, vendor-neutral layer.",
  },
];

// ---------------------------------------------------------------------------
// Pricing tiers
// ---------------------------------------------------------------------------

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "/ public repo / mo",
    blurb: "For open-source maintainers and small experiments.",
    features: [
      "Up to 3 public repositories",
      "100 PR analyses / month",
      "Basic score + evidence explorer",
      "Community support",
      "No data used for training without consent",
    ],
    cta: "Install the GitHub App",
  },
  {
    id: "team",
    name: "Team",
    price: "$29",
    cadence: "/ active developer / mo",
    blurb: "For engineering teams shipping AI-assisted code daily.",
    features: [
      "Private repositories",
      "Unlimited PR analyses",
      "Historical compatibility + codebase memory",
      "Dependency + convention mining",
      "Evidence-linked review comments",
      "Policy engine + merge gates",
      "Dashboard + outcome tracking",
      "Standard support (8h response)",
    ],
    cta: "Start a 14-day trial",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "/ annual contract",
    blurb: "For regulated industries and large engineering orgs.",
    features: [
      "SSO / SAML + RBAC",
      "Audit logs + SIEM integration",
      "On-premise or VPC deployment",
      "Customer-managed keys + data residency",
      "Custom retention + deletion policies",
      "Bring-your-own LLM provider",
      "Incident system integration",
      "Dedicated support + SLA",
    ],
    cta: "Talk to sales",
  },
];

// ---------------------------------------------------------------------------
// Stats for the hero / problem section
// ---------------------------------------------------------------------------

export interface HeroStat {
  value: string;
  label: string;
  sublabel: string;
}

export const heroStats: HeroStat[] = [
  {
    value: "9",
    label: "Calibrated score dimensions",
    sublabel: "Contract, historical, dependency, test, convention, security, ownership, runtime, architecture",
  },
  {
    value: "< 90s",
    label: "Median PR analysis latency",
    sublabel: "p50 target for diffs up to 2,000 LOC",
  },
  {
    value: "100%",
    label: "Evidence-linked review comments",
    sublabel: "Every claim anchored to a verifiable source",
  },
];

// ---------------------------------------------------------------------------
// Threat model summary for the security section
// ---------------------------------------------------------------------------

export interface ThreatItem {
  id: string;
  threat: string;
  impact: ScoreBand;
  mitigation: string;
}

export const threatModel: ThreatItem[] = [
  {
    id: "t-1",
    threat: "Prompt injection via PR body or commit message",
    impact: "high",
    mitigation:
      "LLM never mutates evidence records. Comments are post-processed against an allow-list of file paths and actions before publishing.",
  },
  {
    id: "t-2",
    threat: "Cross-tenant data leakage via shared embedding store",
    impact: "critical",
    mitigation:
      "Per-tenant encryption keys, namespace isolation at storage and retrieval, query-time tenant assertion.",
  },
  {
    id: "t-3",
    threat: "Hallucinated evidence citations",
    impact: "high",
    mitigation:
      "Every evidence reference is resolved against the Evidence Store before publication. Unresolved refs are dropped, not shown.",
  },
  {
    id: "t-4",
    threat: "Provenance forgery via commit trailer",
    impact: "medium",
    mitigation:
      "Declared provenance is recorded as a claim, not a fact. Inferred provenance is computed independently and surfaced alongside.",
  },
  {
    id: "t-5",
    threat: "Excessive GitHub App scopes",
    impact: "medium",
    mitigation:
      "Least-privilege scopes by default. Read-only repo access; write limited to review comments + check runs.",
  },
  {
    id: "t-6",
    threat: "Secret leakage into LLM context",
    impact: "critical",
    mitigation:
      "Diff is scanned by trufflehog-style redaction before context construction. Secrets are replaced with typed placeholders.",
  },
];
