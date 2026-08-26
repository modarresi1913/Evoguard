<a name="top"></a>

<div align="center">

# 🛡️ EvoGuard

### **Context before merge.**

**Evidence-driven control for AI-assisted code changes.**

A **Context-Aware AI Code Integration** platform that evaluates, explains, and gates every AI-touched Pull Request against your codebase's history, contracts, dependencies, tests, conventions, and security constraints — *before* it reaches `main`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmodarresi1913%2FEvoguard&project-name=evoguard&repository-name=Evoguard&env=NEXT_TELEMETRY_DISABLED&envDescription=No+environment+variables+required+for+the+demo&demo-title=EvoGuard+Demo&demo-description=Evidence-driven+AI+code+review+dashboard)

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/modarresi1913/Evoguard)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](#-deploy-to-vercel)

**AI Code Reviewer · Code Provenance Tracker · Context-Aware Code Analysis · Pull Request Quality Gate**

[**🚀 Deploy to Vercel**](#-deploy-to-vercel) · [**📖 Documentation**](#-table-of-contents) · [**🎯 Use Cases**](#-who-is-this-for) · [**💬 Ask AI**](#-ask-evoguard-anything-aeo) · [**⚙️ Architecture**](#-architecture)

</div>

---

> ### 💡 The one-sentence pitch
> **EvoGuard is the trust layer between AI code generation tools and your `main` branch — turning AI-generated code into safe, evidence-backed, reviewable changes.**

---

## 🚀 Deploy to Vercel

EvoGuard is a **self-deployable template**. Fork the repo, click the button below, and you'll have your own live instance in under 2 minutes — using **your own Vercel token**, on **your own account**.

### One-click deploy (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmodarresi1913%2FEvoguard&project-name=evoguard&repository-name=Evoguard&env=NEXT_TELEMETRY_DISABLED&envDescription=No+environment+variables+required+for+the+demo&demo-title=EvoGuard+Demo&demo-description=Evidence-driven+AI+code+review+dashboard)

> **No environment variables required** for the demo dashboard — all mock data is bundled. The button above will:
> 1. Fork `modarresi1913/Evoguard` to your GitHub account
> 2. Create a new Vercel project linked to your fork
> 3. Deploy with your Vercel account (your own token, your own quota)
> 4. Give you a live URL like `evoguard-xxxxx.vercel.app`

### Automated deploy via GitHub Actions (optional)

After your first deploy, you can enable automated deployments from GitHub Actions so every push to `main` triggers a production deploy:

1. Create a Vercel token at [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. In your forked repo, go to **Settings → Secrets and variables → Actions → New repository secret**
3. Add these three secrets:

| Secret name | Where to find it |
|---|---|
| `VERCEL_TOKEN` | The token you created in step 1 |
| `VERCEL_ORG_ID` | Vercel project → Settings → General → "Org ID" |
| `VERCEL_PROJECT_ID` | Vercel project → Settings → General → "Project ID" |

4. Push to `main` — the `vercel-deploy.yml` workflow will deploy automatically and post the URL as a comment on every PR

> 💡 See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full guide (CLI, custom domains, troubleshooting).

---

## 📑 Table of Contents

1. [Deploy to Vercel](#-deploy-to-vercel)
2. [The Problem We Solve](#-the-problem-we-solve)
3. [What EvoGuard Does](#-what-evoguard-does)
4. [Core Principles](#-core-principles)
5. [The Nine-Dimensional Score (ECS)](#-the-nine-dimensional-score-ecs)
6. [Architecture](#-architecture)
7. [Live Demo](#-live-demo)
8. [Who Is This For?](#-who-is-this-for)
9. [How It Works](#-how-it-works)
10. [Comparison](#-comparison)
11. [Security & Privacy](#-security--privacy)
12. [Pricing](#-pricing)
13. [Roadmap](#-roadmap-90-day-pilot)
14. [Tech Stack](#-tech-stack)
15. [Quick Start](#-quick-start)
16. [Project Structure](#-project-structure)
17. [Ask EvoGuard Anything (AEO)](#-ask-evoguard-anything-aeo)
18. [FAQ](#-faq)
19. [Contributing](#-contributing)
20. [License](#-license)
21. [Star History](#-star-history)

---

## 🔥 The Problem We Solve

> **Code generation is no longer the bottleneck. Integration into a living codebase is.**

In the era of AI code generation tools — GitHub Copilot, Cursor, Codeium, Cody, Continue — producing code has become nearly free. But **merging that code into a production codebase safely has become harder than ever.**

### The hidden cost of AI-assisted development

A Pull Request can:
- ✅ Pass syntax and type checks
- ✅ Satisfy the linter
- ✅ Clear CI/CD
- ✅ Look syntactically correct in code review

…and still ship a **production regression** — because the decisive context is rarely in the diff. It lives in:

| Hidden pressure | Why it matters | What breaks |
|---|---|---|
| **Past rollbacks & reverts** | Patterns that broke production last quarter are invisible to fresh PR review | The same regression ships again |
| **Silently deprecated dependencies** | A pinned version from two weeks ago still passes type-check — but is EOL | Runtime failures in production |
| **Unspoken conventions** | "Never call `fetch()` directly, use `httpClient`" lives in a Slack thread from 2024 | Internal contract violations |
| **Security & compliance drift** | PII in a log payload, a bypassed security check — none are syntax errors | Compliance incidents, breaches |
| **Architectural drift** | Boundary crossings the team agreed never to make — but never codified in ADRs | Service boundary erosion |

### Why current tools don't solve this

- **GitHub Copilot, Cursor, Codeium** generate code. They don't know your codebase's history.
- **CodeRabbit, Qodo, Snyk Code** review syntax and patterns. They don't bind changes to observed outcomes.
- **SonarQube, Semgrep, Snyk** find vulnerabilities. They don't know what previously caused rollbacks in *your* repo.
- **Your existing CI** runs tests. It doesn't tell you whether a similar change previously triggered an incident.

**EvoGuard sits in the gap.** It's not another code generator, another SAST tool, or another AI reviewer — it's an **outcome-bound trust layer** that binds every change to what your codebase already remembers.

<p align="right"><a href="#top">↑ back to top</a></p>

---

## ✨ What EvoGuard Does

EvoGuard is a **Context-Aware AI Code Integration** platform with **nine core capabilities**:

### 1. 🧭 Context-Aware Change Risk
Score changes against your codebase's own pressure history — not against generic best practices. EvoGuard reasons about *consequences*, not syntax.

### 2. 🧠 Codebase Memory
Mine revert, rollback, hotfix, and incident patterns into reusable historical constraints. Patterns that previously caused outages become first-class constraints on future PRs — with confidence and decay.

### 3. 🔍 Evidence-Driven Review
Every claim is anchored to a verifiable source: commit, PR, CI run, advisory, CODEOWNERS file. No free-floating LLM verdicts — every review comment links to the evidence that produced it.

### 4. 🆔 AI Provenance Tracking
Record declared, inferred, and unknown provenance for every change set — never claim certainty. Provenance is stored as a probabilistic record, with confidence bands and retention controls.

### 5. 📊 Multi-Dimensional Score (ECS)
**Ecosystem Compatibility Score** with 9 calibrated dimensions and confidence bands. Each dimension has known false-positive and false-negative modes — surfaced to the reviewer, not hidden.

### 6. 🛡️ Policy & Merge Gates
Repository- and team-level policies translate scores into actionable merge decisions. Thresholds are calibrated per-repo — never global constants.

### 7. 🔧 Contextual Repair Loop
Generate patch suggestions grounded in evidence; **never auto-merge for score alone**. Rewrite prompts carry explicit repository constraints — banned patterns, deprecated APIs, owner approvals.

### 8. 📈 Outcome-Based Memory
Track merge → rollback → incident correlation to calibrate scoring over time. Outcomes are the ground truth — EvoGuard closes the loop.

### 9. 🔒 Audit & Privacy Layer
Least-privilege GitHub scopes, tenant isolation, secret redaction, retention controls. On-prem deployment and customer-managed keys available for enterprise tenants.

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 🎯 Core Principles

EvoGuard is built on **six inviolable principles**. These are not features — they are the contract we keep with every customer.

| # | Principle | What it means in practice |
|---|---|---|
| 1 | **The Pull Request is the unit of work** | Not the line, not the symbol. EvoGuard reasons about complete change sets. |
| 2 | **Deterministic evidence is the source of truth** | Tests, lint, dependency versions, policy violations, secrets, SAST findings, ownership — all resolved against verifiable records. |
| 3 | **The LLM explains; it never decides alone** | The model translates evidence into review comments and rewrite prompts. It never mutates evidence, decides merges, or overrides policy. |
| 4 | **Provenance is probabilistic** | Declared, inferred, or unknown — never claimed with certainty. Stored with confidence bands and retention controls. |
| 5 | **No patch auto-merges for score alone** | Human approval is required for consequential changes. Score is input to the decision, not the decision. |
| 6 | **Observation, inference, and policy are kept separate** | Inferences are never displayed as facts. Each layer is auditable. |

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 📊 The Nine-Dimensional Score (ECS)

**ECS — Ecosystem Compatibility Score** — is a weighted, confidence-banded score across **nine calibrated dimensions**. Every dimension has its own inputs, evidence type, and known false-positive / false-negative modes.

### The formula

```text
ECS = w1 · Contract
    + w2 · Historical
    + w3 · Dependency
    + w4 · Test
    + w5 · Convention
    + w6 · Architecture
    + w7 · Security       (inverted — lower is riskier)
    + w8 · Ownership      (inverted)
    + w9 · Runtime        (when telemetry available)
```

> ⚠️ Weights are **not constants**. They are calibrated per-repository against observed outcomes — what previously caused a rollback in your codebase shapes the weight applied to the next PR.

### The nine dimensions

| # | Dimension | What it measures | Inputs |
|---|---|---|---|
| 1 | **Contract Compatibility** | Public API surface preservation | AST diff, breaking-change detector, OpenAPI/protobuf specs |
| 2 | **Historical Compatibility** | Match against prior rollback/revert/hotfix patterns | Pattern signature on affected files & symbols |
| 3 | **Dependency Compatibility** | Pinned versions vs. deprecation advisories | Resolved version vs. advisory database |
| 4 | **Test Compatibility** | Coverage delta on changed symbols, flaky history | Coverage report + diff coverage |
| 5 | **Convention Compatibility** | Drift from mined repository conventions | Deviation count from mined convention set |
| 6 | **Security Risk** | SAST, secret scan, PII classifier, OWASP | SAST findings + secret scan results |
| 7 | **Ownership & Review Risk** | CODEOWNERS, delegated authority, PTO calendar | Reviewer assignment + delegated authority graph |
| 8 | **Runtime Risk** | Canary telemetry, A/B labels, SLO breach history | Runtime metrics correlated to changed symbols |
| 9 | **Architecture Compatibility** | Service boundaries, ADR records, dependency direction | Boundary violation detector + ADR scanner |

### Policy bands (per-repo, calibrated)

| Score range | Band | Action |
|---|---|---|
| **90 – 100** | Low-friction | Merge with normal review |
| **70 – 89** | Review | Merge with review |
| **50 – 69** | Review required | Mandatory review or additional tests |
| **0 – 49** | Block | Block or special approval |

> Thresholds are calibrated per repository against baseline outcomes — never globally fixed.

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 🏗️ Architecture

EvoGuard is built as a **five-layer pipeline with fourteen services**. The LLM is a translator, not a source of truth — all evidence is verifiable.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  01 · INGEST                                                            │
│  ┌────────────────────┐  ┌────────────────────┐                       │
│  │  GitHub App /      │  │  Change            │                       │
│  │  Integration Layer │──│  Normalization     │                       │
│  └────────────────────┘  └────────────────────┘                       │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  02 · EVIDENCE                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │  Git History │  │   Static     │  │  CI / Test   │                  │
│  │    Miner     │  │  Analysis    │  │  Evidence    │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  03 · CONTEXT                                                           │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  Dependency &   │  │   Evidence   │  │   Context    │               │
│  │  Convention     │──│    Store     │──│   Builder    │               │
│  └─────────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  04 · DECISION                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │    Risk       │  │     LLM      │  │    Policy    │                 │
│  │  Scoring      │──│ Explanation  │──│    Engine    │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  05 · DELIVERY                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐                   │
│  │  Review Comments &   │  │  Reviewer Decision & │                   │
│  │  Dashboard           │  │  Outcome Tracker     │                   │
│  └──────────────────────┘  └──────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Three architectural principles

1. **Deterministic truth** — Tests, lint, dependency versions, policy violations, secrets, SAST, ownership — all resolved against verifiable records, never against LLM verdicts.
2. **LLM as translator** — The model explains evidence, drafts review comments, and proposes rewrite prompts. It does not mutate evidence, decide merges, or override policy.
3. **Tenant isolation by design** — Per-tenant encryption keys, namespace isolation at storage and retrieval, query-time tenant assertion. On-prem deployment available for enterprise.

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 🌐 Live Demo

The repository includes a fully interactive demo dashboard built with Next.js 16. It showcases:

- **Risk Overview** — ECS score with 9-dimension breakdown, confidence bands, top evidence
- **Evidence Explorer** — Filterable, searchable evidence list with source references
- **Historical Patterns** — Codebase memory with observation/inference/policy separation
- **Provenance Records** — Declared, inferred, unknown provenance with confidence and schema
- **Review Comments** — Evidence-linked comments with file:line, severity, suggested actions
- **Policy & Gates** — Enforceable repository-level merge policies

### Run the demo locally

```bash
# Clone the repository
git clone https://github.com/modarresi1913/Evoguard.git
cd Evoguard

# Install dependencies (requires Node 18+ and Bun)
bun install

# Start the dev server
bun run dev

# Open the demo
open http://localhost:3000
```

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 👥 Who Is This For?

### Beachhead market: mid-size engineering teams shipping AI-assisted code daily

EvoGuard is built for **engineering teams of 15–200 developers** who:

- Use GitHub Copilot, Cursor, Codeium, or other AI code generation tools daily
- Have a codebase with **3+ years of history** (rollbacks, incidents, deprecated dependencies)
- Are in **regulated industries** (fintech, healthtech, SaaS, enterprise)
- Have **multiple AI tools in use simultaneously** — Copilot for one team, Cursor for another
- Need **defensible review decisions** — not just "the AI said so"

### Primary personas

| Persona | Primary pain | What EvoGuard gives them |
|---|---|---|
| **Developer** | "I don't know if this AI-suggested change will break something" | Evidence-linked review comments before merge |
| **Staff Engineer** | "I'm reviewing AI-generated PRs I didn't write and don't fully understand" | Historical compatibility context bound to outcomes |
| **Engineering Manager** | "How do I measure AI codegen quality across the team?" | Adoption + quality + business metrics |
| **Security Engineer** | "AI tools bypass our security conventions silently" | SAST, secret scan, PII classifier integration |
| **Platform / DevOps Engineer** | "AI PRs cause rollbacks at 2am" | Canary gates, runtime risk dimension |
| **Enterprise Architect** | "Architectural drift is invisible until it's too late" | ADR scanner, boundary violation detector |
| **CTO** | "How do I justify AI tooling spend to the board?" | Outcome-based ROI: rollback prevention, incident reduction |

### Who should *not* use EvoGuard yet

- **Very small teams (<5 engineers)** — your codebase isn't complex enough to need outcome memory
- **Pure greenfield projects** — no history to mine, no patterns to enforce
- **Single-language micro-repos** — overhead exceeds value

<p align="right"><a href="#top">↑ back to top</a></p>

---

## ⚙️ How It Works

### End-to-end PR flow

```
1. Developer opens PR
   └─ AI-assisted code (Copilot / Cursor / etc.)

2. GitHub App webhook fires
   └─ EvoGuard ingests diff, commits, metadata

3. Change Normalization
   └─ File classification, symbol extraction

4. Evidence collection (parallel)
   ├─ Git History Miner: rollback/revert/hotfix patterns
   ├─ Static Analysis: SAST, lint, contract check
   └─ CI/Test Evidence: runs, failures, flaky history

5. Context building
   ├─ Dependency & Convention mining
   ├─ Evidence Store (versioned, queryable)
   └─ Context Builder composes structured prompt context

6. Risk scoring
   └─ Multi-dimensional ECS with confidence bands

7. LLM explanation layer
   ├─ Translate evidence → review comments
   └─ Generate rewrite prompts (if needed)

8. Policy engine
   └─ Apply merge gates per repository

9. Delivery
   ├─ Publish evidence-linked comments to GitHub PR
   ├─ Update web dashboard
   └─ Capture reviewer decision

10. Outcome tracking (closed loop)
    └─ Merge / rollback / incident → calibrate weights
```

### Key invariant

**The LLM never mutates evidence records.** Comments are post-processed against an allow-list of file paths and actions before publishing. Unresolved evidence references are dropped, never shown.

<p align="right"><a href="#top">↑ back to top</a></p>

---

## ⚖️ Comparison

### How EvoGuard differs from existing categories

| Category | Examples | What they do | What EvoGuard adds |
|---|---|---|---|
| **AI code generation** | Copilot, Cursor, Codeium, Cody | Generate code from prompts | Validates generated code against your codebase's history before merge |
| **AI code review** | CodeRabbit, Qodo, PR-Agent | Summarize diffs, suggest improvements | Binds changes to outcome history — not just diff analysis |
| **SAST** | Snyk, Semgrep, SonarQube | Find vulnerabilities in code | Adds historical context: "this pattern previously caused an incident" |
| **Dependency scanning** | Dependabot, Snyk | Detect vulnerable dependencies | Detects *deprecated* dependencies and version drift |
| **Code quality platforms** | SonarQube, Code Climate | Measure maintainability metrics | Adds context-aware scoring calibrated per-repo |
| **Developer analytics** | LinearB, Jellyfish | Measure engineering metrics | Closes the loop: change → outcome → calibration |
| **Internal dev portals** | Backstage, Port | Service catalog & docs | Enforces architectural boundaries from ADRs |
| **CI policy engines** | GitHub Actions, CircleCI | Run tests & gates | Adds evidence-bound decision layer above CI |
| **Supply chain provenance** | Sigstore, SLSA | Verify artifact provenance | Tracks *code* provenance (AI-generated, declared) |

### The gap EvoGuard fills

**No existing tool binds changes to observed outcomes inside a single codebase.** That binding — "this pattern, in this repo, previously caused this rollback" — is the secret. It's per-organization, accumulates with use, and cannot be copied by a competitor even with the same source code.

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 🔒 Security & Privacy

### Threat model (working draft — top 6 of 19 tracked threats)

| Threat | Impact | Mitigation |
|---|---|---|
| Prompt injection via PR body or commit message | High | LLM never mutates evidence records. Comments post-processed against allow-list before publishing. |
| Cross-tenant data leakage via shared embedding store | Critical | Per-tenant encryption keys, namespace isolation at storage and retrieval, query-time tenant assertion. |
| Hallucinated evidence citations | High | Every evidence reference resolved against Evidence Store before publication. Unresolved refs dropped. |
| Provenance forgery via commit trailer | Medium | Declared provenance recorded as claim, not fact. Inferred provenance computed independently and surfaced alongside. |
| Excessive GitHub App scopes | Medium | Least-privilege scopes by default. Read-only repo access; write limited to review comments + check runs. |
| Secret leakage into LLM context | Critical | Diff scanned by trufflehog-style redaction before context construction. Secrets replaced with typed placeholders. |

### Security policies

| Policy | Implementation |
|---|---|
| **Least-privilege GitHub scopes** | Read-only repo access. Write limited to review comments + check runs. |
| **Encryption in transit** | TLS 1.3 enforced everywhere. |
| **Encryption at rest** | AES-256 with per-tenant keys. |
| **Tenant isolation** | Per-tenant encryption keys, namespace isolation, query-time assertion. |
| **Secret redaction** | Diff scanned before LLM context construction. Secrets replaced with placeholders. |
| **Audit log** | Every action recorded. SIEM integration available for enterprise. |
| **Retention policy** | Default 90 days. Customer-configurable. |
| **On-premise / VPC** | Enterprise tenants can run EvoGuard inside their own boundary. |
| **Customer-managed keys** | Per-tenant encryption keys; customer controls rotation and revocation. |
| **SSO / SAML / RBAC** | Enterprise tier. |
| **No training without consent** | Customer data never used to fine-tune production models without explicit, revocable consent. |
| **Data residency** | Enterprise tier: EU, US, APAC regions available. |
| **Incident response** | Documented runbooks, 24h SLA for security incidents (enterprise). |

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 💰 Pricing

### Three tiers — pricing aligned with adoption, not seats

| Tier | Price | Best for | Key features |
|---|---|---|---|
| **Free** | $0 / public repo / month | OSS maintainers, small experiments | 3 public repos, 100 PR analyses/month, basic score + evidence explorer |
| **Team** *(recommended)* | $29 / active developer / month | Teams shipping AI-assisted code daily | Private repos, unlimited PR analyses, historical compatibility, dependency analysis, evidence-linked review comments, policy engine, dashboard, outcome tracking |
| **Enterprise** | Custom / annual | Regulated industries, large engineering orgs | SSO/SAML, RBAC, audit logs, SIEM integration, on-prem/VPC, customer-managed keys, data residency, bring-your-own LLM, incident system integration, dedicated support + SLA |

### Why per active developer?

The Team tier charges per **active developer** — only engineers who actually trigger PR analyses are billed. Static reviewers, bots, and CI service accounts don't count.

### No training without consent

> No customer data is used for model training without explicit, revocable consent. Free tier repositories are never used to fine-tune production scoring models.

[**💬 Talk to sales for Enterprise**](#-contact)

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 🗓️ Roadmap (90-day pilot)

### Phase 1 · Days 1–30 — Evidence MVP

| Capability | Status |
|---|---|
| GitHub App | ✅ Designed |
| PR ingestion | ✅ Designed |
| Diff & commit analysis | ✅ Designed |
| Static analysis | ✅ Designed |
| CI result collection | ✅ Designed |
| Test result collection | ✅ Designed |
| Dependency extraction (initial) | ✅ Designed |
| Basic report | ✅ Designed |
| Privacy baseline | ✅ Designed |
| Audit log (basic) | ✅ Designed |

### Phase 2 · Days 31–60 — Historical Compatibility

| Capability | Status |
|---|---|
| Revert detection | 🚧 In progress |
| Rollback detection | 🚧 In progress |
| Historical pattern mining | 🚧 In progress |
| Dependency compatibility | 🚧 In progress |
| Evidence-linked review comments | 🚧 In progress |
| Convention extraction | 🚧 In progress |
| Feedback capture | 🚧 In progress |
| Score calibration (initial) | 🚧 In progress |

### Phase 3 · Days 61–90 — Production Pilot

| Capability | Status |
|---|---|
| Policy engine | 📋 Planned |
| Dashboard | ✅ Demo available |
| Outcome tracking | 📋 Planned |
| Pilot with real repositories | 📋 Planned |
| Usability testing | 📋 Planned |
| Reliability improvement | 📋 Planned |
| Cost optimization | 📋 Planned |
| Security hardening | 📋 Planned |
| Initial case study | 📋 Planned |
| Go/no-go decision | 📋 Planned |

### Beyond day 90

- GitLab & Bitbucket support
- Full runtime behavior analysis
- Predictive refactor suggestions
- Cross-organization learning (opt-in)
- Custom LLM provider integration
- Incident management system integration
- Multi-language support expansion

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 🛠️ Tech Stack

### This repository (demo + marketing site)

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (New York style) |
| **Icons** | [Lucide](https://lucide.dev/) |
| **Fonts** | [Geist Sans](https://vercel.com/font) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) |
| **Charts** | Custom components (Recharts-compatible data shapes) |

### Production architecture (designed, not all in this repo)

| Layer | Technology |
|---|---|
| **Backend** | Node.js / Bun + TypeScript |
| **Database** | PostgreSQL (metadata) + Vector DB (embeddings) |
| **ORM** | Prisma |
| **Cache** | Redis |
| **Queue** | BullMQ |
| **GitHub Integration** | GitHub App (Probot-style) |
| **LLM Provider** | Pluggable: OpenAI / Anthropic / self-hosted (enterprise) |
| **Static Analysis** | Tree-sitter + Semgrep + custom analyzers |
| **Secret Scanning** | Trufflehog-style redaction pipeline |
| **Auth** | NextAuth.js + SAML (enterprise) |
| **Deployment** | Vercel / AWS / on-prem (enterprise) |

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/) (recommended) or npm/pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/modarresi1913/Evoguard.git
cd Evoguard

# Install dependencies
bun install

# Start the development server
bun run dev
```

The app will be available at <http://localhost:3000>.

### Available scripts

```bash
bun run dev      # Start dev server (port 3000)
bun run build    # Production build
bun run lint     # ESLint check
bun run db:push  # Push Prisma schema to database
```

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 📁 Project Structure

```
Evoguard/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout, metadata, dark theme
│   │   ├── page.tsx                  # Composes all sections
│   │   └── globals.css               # EvoGuard dark theme, custom CSS
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   └── evoguard/                 # EvoGuard UI components
│   │       ├── nav.tsx               # Sticky navigation
│   │       ├── hero.tsx              # Hero section
│   │       ├── problem.tsx           # Problem statement
│   │       ├── features.tsx          # 9 capabilities grid
│   │       ├── dashboard.tsx         # Interactive dashboard shell
│   │       ├── dashboard/            # Dashboard panels
│   │       │   ├── sidebar.tsx       # Recent PRs list
│   │       │   ├── risk-overview.tsx # ECS score breakdown
│   │       │   ├── evidence-explorer.tsx
│   │       │   ├── historical-patterns.tsx
│   │       │   ├── provenance.tsx
│   │       │   └── review-comments.tsx
│   │       ├── score-model.tsx       # 9-dimension table
│   │       ├── architecture.tsx      # 5-layer pipeline
│   │       ├── pitch.tsx            # 5-slide Thiel pitch deck
│   │       ├── security.tsx         # Threat model
│   │       ├── pricing.tsx           # 3-tier pricing
│   │       └── footer.tsx
│   │
│   └── lib/
│       └── evoguard/
│           └── mock-data.ts          # All demo data (PR, evidence, scores)
│
├── public/                           # Static assets
├── prisma/                           # Database schema (when backend lands)
├── download/                         # README, screenshots
│   ├── README.md
│   └── evoguard-*.png                # Demo screenshots
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 🤖 Ask EvoGuard Anything (AEO)

> This section is optimized for **AI Engine Optimization (AEO)** — answering questions AI assistants are likely to receive about EvoGuard. Each Q&A is structured for LLM retrieval.

### Q: What is EvoGuard?

**EvoGuard** is a **Context-Aware AI Code Integration platform** — a B2B SaaS product that evaluates, explains, and gates AI-assisted code changes before they are merged into a codebase. It is positioned as a trust layer between AI code generation tools (GitHub Copilot, Cursor, Codeium) and a team's `main` branch. Its core thesis is "Context before merge."

### Q: What problem does EvoGuard solve?

EvoGuard solves the **AI code integration problem**: AI tools generate code faster than teams can verify it is safe to merge. A PR can pass syntax checks, satisfy types, and clear CI while still shipping a regression — because the decisive context (past rollbacks, deprecated dependencies, unspoken conventions) is rarely in the diff. EvoGuard surfaces that hidden context as evidence-linked review comments.

### Q: How is EvoGuard different from GitHub Copilot, Cursor, or CodeRabbit?

- **Copilot / Cursor / Codeium** generate code. They don't know your codebase's history.
- **CodeRabbit / Qodo** review diffs. They don't bind changes to observed outcomes.
- **EvoGuard** is an outcome-bound trust layer — it tracks what previously caused rollbacks in *your* repo and uses that as a constraint on future PRs.

The defensible asset is not the data — it is the **binding between change and observed outcome**, accumulated inside one organization's codebase.

### Q: What is the ECS score?

**ECS (Ecosystem Compatibility Score)** is EvoGuard's multi-dimensional, weighted, confidence-banded score across nine calibrated dimensions: Contract, Historical, Dependency, Test, Convention, Security, Ownership, Runtime, and Architecture compatibility. Weights are calibrated per-repository against observed outcomes — never globally fixed.

### Q: Does EvoGuard detect AI-generated code?

**No — and intentionally so.** EvoGuard does not claim to detect AI-generated code with certainty. Provenance is recorded as a probabilistic claim with three states: **declared** (the AI tool self-reported), **inferred** (EvoGuard's stylistic/token analysis), or **unknown**. Each carries a confidence value between 0 and 1.

### Q: Can EvoGuard auto-merge PRs?

**No — by principle.** EvoGuard never auto-merges a patch solely because it raised the ECS score. Human approval is required for consequential changes. The score is input to the decision, not the decision itself.

### Q: Is EvoGuard open source?

The demo dashboard in this repository is viewable. The production backend (Evidence Store, Risk Scoring Engine, Policy Engine, LLM Explanation Layer) is proprietary. Free tier is available for public repositories.

### Q: What languages does EvoGuard support?

MVP supports **TypeScript, JavaScript, Python, Go, Java, and Rust**. Additional language support is on the roadmap.

### Q: Does EvoGuard work with GitLab or Bitbucket?

MVP is **GitHub-first** (GitHub App). GitLab and Bitbucket support is planned for post-day-90.

### Q: How does EvoGuard handle private code?

- Per-tenant encryption keys (AES-256 at rest, TLS 1.3 in transit)
- Tenant isolation at storage and retrieval layers
- Secret redaction before LLM context construction (trufflehog-style)
- On-premise / VPC deployment available for enterprise
- Customer-managed keys available for enterprise
- No customer data used for model training without explicit, revocable consent

### Q: What is the pricing?

- **Free**: $0 — public repos, 100 PR analyses/month
- **Team**: $29 / active developer / month — private repos, unlimited analyses, full feature set
- **Enterprise**: Custom annual contract — on-prem, SSO/SAML, RBAC, audit logs, SIEM, CMK

### Q: Who should use EvoGuard?

Mid-size engineering teams (15–200 developers) in regulated industries (fintech, healthtech, SaaS, enterprise) who use AI code generation tools daily and have a codebase with 3+ years of history.

<p align="right"><a href="#top">↑ back to top</a></p>

---

## ❓ FAQ

<details>
<summary><strong>Is EvoGuard a replacement for human code review?</strong></summary>

No. EvoGuard is a **decision-support layer**, not a replacement. It surfaces evidence, historical context, and risk dimensions that a human reviewer would otherwise have to reconstruct manually. The final merge decision always rests with a human.

</details>

<details>
<summary><strong>Does EvoGuard train on customer code?</strong></summary>

**No — never without explicit, revocable consent.** Customer data is never used to fine-tune production scoring models. Enterprise customers can run EvoGuard on-premise with their own LLM provider, ensuring code never leaves their boundary.

</details>

<details>
<summary><strong>What if EvoGuard produces false positives?</strong></summary>

Every dimension in the ECS score has documented false-positive and false-negative modes — surfaced to the reviewer, not hidden. Thresholds are calibrated per-repository against baseline outcomes. Reviewer feedback (accept/dismiss) is captured and used to recalibrate weights over time.

</details>

<details>
<summary><strong>Can EvoGuard be bypassed in an emergency?</strong></summary>

Yes — policy bypasses are supported via documented emergency procedures. Every bypass is logged to the audit trail with the bypassing user, reason, and timestamp. Bypasses are reviewed post-hoc.

</details>

<details>
<summary><strong>What LLM does EvoGuard use?</strong></summary>

EvoGuard's LLM Explanation Layer is **pluggable**. Default uses OpenAI or Anthropic. Enterprise customers can bring their own LLM provider (including self-hosted models) to ensure code and context never leave their boundary.

</details>

<details>
<summary><strong>How long does PR analysis take?</strong></summary>

Target latency: **under 90 seconds p50, under 240 seconds p95** for diffs up to 2,000 LOC. Larger diffs are processed asynchronously with progress indicators.

</details>

<details>
<summary><strong>What happens if EvoGuard goes down?</strong></summary>

EvoGuard is designed with **fail-open** behavior for non-blocking dimensions and **fail-closed** for blocking policies. If the service is unavailable, PRs can still merge (with a degraded-mode comment) unless an enforced policy explicitly requires EvoGuard approval.

</details>

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 🤝 Contributing

We are not yet accepting external contributions, but **design partner inquiries** are welcome. If you are an engineering team that:

- Uses AI code generation tools daily
- Has a codebase with 3+ years of history
- Is willing to share outcome labels (merge/rollback/incident) for calibration

…we'd love to talk. Reach out via [GitHub Issues](https://github.com/modarresi1913/Evoguard/issues) or open a discussion.

### For internal contributors

```bash
# Clone
git clone https://github.com/modarresi1913/Evoguard.git
cd Evoguard

# Create a feature branch
git checkout -b feat/your-feature

# Make changes, run lint
bun run lint

# Commit with conventional commits
git commit -m "feat: add new evidence type"

# Push and open PR
git push -u origin feat/your-feature
```

<p align="right"><a href="#top">↑ back to top</a></p>

---

## 📄 License

**Proprietary** — © 2026 EvoGuard. All rights reserved.

The demo dashboard source code in this repository is viewable for portfolio and evaluation purposes. Production backend components are proprietary and not included.

For licensing inquiries, enterprise deployments, or design partner opportunities, please [open an issue](https://github.com/modarresi1913/Evoguard/issues).

<p align="right"><a href="#top">↑ back to top</a></p>

---

## ⭐ Star History

<a href="https://github.com/modarresi1913/Evoguard/stargazers">
  <img width="500" alt="Star History Chart" src="https://api.star-history.com/svg?repos=modarresi1913/Evoguard&type=Date"/>
</a>

---

## 🔗 Links

- **Repository**: [github.com/modarresi1913/Evoguard](https://github.com/modarresi1913/Evoguard)
- **Issues**: [github.com/modarresi1913/Evoguard/issues](https://github.com/modarresi1913/Evoguard/issues)
- **Discussions**: [github.com/modarresi1913/Evoguard/discussions](https://github.com/modarresi1913/Evoguard/discussions)

---

## 📊 Repository Stats

![Repo Size](https://img.shields.io/github/repo-size/modarresi1913/Evoguard?style=flat-square&color=10b981)
![Code Size](https://img.shields.io/github/languages/code-size/modarresi1913/Evoguard?style=flat-square&color=10b981)
![Languages](https://img.shields.io/github/languages/count/modarresi1913/Evoguard?style=flat-square&color=10b981)
![Last Commit](https://img.shields.io/github/last-commit/modarresi1913/Evoguard?style=flat-square&color=10b981)
![Issues](https://img.shields.io/github/issues/modarresi1913/Evoguard?style=flat-square&color=10b981)
![License](https://img.shields.io/badge/license-Proprietary-8b5cf6?style=flat-square)

---

<div align="center">

### 🛡️ **Context before merge.**

**Evidence-driven control for AI-assisted code changes.**

Built with ❤️ for engineering teams who refuse to merge blind.

[⭐ Star this repo](https://github.com/modarresi1913/Evoguard) · [🐛 Report bug](https://github.com/modarresi1913/Evoguard/issues) · [💡 Request feature](https://github.com/modarresi1913/Evoguard/issues)

</div>

---

<!-- SEO Meta (hidden)
Keywords: AI code review, code provenance, context-aware code analysis, pull request quality gate,
GitHub Copilot safety, Cursor AI safety, AI code integration, codebase memory, evidence-driven review,
AI code reviewer, code review automation, PR analysis tool, developer tools, B2B SaaS, AI-assisted development,
code quality, static analysis, SAST, dependency scanning, technical debt management, AI code generation safety,
context-aware code review, AI provenance tracking, codebase history analysis, pull request risk assessment,
EvoGuard, Context before merge, ECS score, ecosystem compatibility score, AI code trust layer
-->

<!-- Structured Data for Search Engines (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EvoGuard",
  "description": "Evidence-driven control for AI-assisted code changes. A Context-Aware AI Code Integration platform that evaluates, explains, and gates AI-touched Pull Requests before they reach main.",
  "url": "https://github.com/modarresi1913/Evoguard",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "EvoGuard"
  },
  "keywords": "AI code review, code provenance, context-aware, GitHub App, pull request analysis, codebase memory, developer tools"
}
</script>
