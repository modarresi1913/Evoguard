# EvoGuard

> **Context before merge.** Evidence-driven control for AI-assisted code changes.

EvoGuard is a B2B SaaS platform for **Context-Aware AI Code Integration** — it evaluates, explains, and gates every AI-touched Pull Request against a codebase's history, contracts, dependencies, tests, conventions and security constraints *before* it reaches `main`.

This repository contains the **EvoGuard marketing site + interactive demo dashboard**, built with Next.js 16, TypeScript, Tailwind CSS 4 and shadcn/ui.

---

## Why EvoGuard exists

Code generation is no longer the bottleneck. Integration into a living codebase is.

A PR can pass syntax checks, satisfy types, clear CI — and still ship a regression, because the decisive context is rarely in the diff. It lives in:

- Past rollbacks and reverts
- Silently deprecated dependencies
- Unspoken conventions (Slack threads from 2024)
- Security and compliance drift
- Architectural decisions never codified

EvoGuard makes that hidden context part of the review.

---

## Core principles

1. **The Pull Request is the unit of work** — not the line, not the symbol.
2. **Deterministic evidence is the source of truth** — tests, lint, dependency versions, policy violations, secrets, SAST findings, ownership.
3. **The LLM explains; it never decides alone** — it translates evidence into review comments and rewrite prompts.
4. **Provenance is probabilistic** — declared, inferred, or unknown — never claimed with certainty.
5. **No patch auto-merges for score alone** — human approval is required for consequential changes.
6. **Observation, inference, and policy are kept separate** — inferences are never displayed as facts.

---

## The nine-dimensional score (ECS)

**Ecosystem Compatibility Score** is a weighted, confidence-banded score across nine calibrated dimensions:

| Dimension | What it measures |
|---|---|
| Contract Compatibility | Public API surface preservation |
| Historical Compatibility | Match against prior rollback / revert / hotfix patterns |
| Dependency Compatibility | Pinned versions vs. deprecation advisories |
| Test Compatibility | Coverage delta on changed symbols, flaky history |
| Convention Compatibility | Drift from mined repository conventions |
| Security Risk | SAST, secret scan, PII classifier, OWASP |
| Ownership & Review Risk | CODEOWNERS, delegated authority, PTO calendar |
| Runtime Risk | Canary telemetry correlation (when available) |
| Architecture Compatibility | Service boundary violations, ADR compliance |

Weights are calibrated per-repository against observed outcomes — never globally fixed.

---

## Architecture (5 layers, 14 services)

```
INGEST     → Integration Layer · Change Normalization
EVIDENCE   → Git History Miner · Static Analysis · CI/Test Evidence
CONTEXT    → Dependency & Convention Context · Evidence Store · Context Builder
DECISION   → Risk Scoring Engine · LLM Explanation Layer · Policy Engine
DELIVERY   → Review Comments & Dashboard · Outcome Tracker
```

The LLM is a translator, not a source of truth. All evidence is verifiable.

---

## Running locally

```bash
bun install
bun run dev
```

Open <http://localhost:3000>.

### What's in this repository

- `src/app/` — Next.js App Router entry, layout, global theme
- `src/components/evoguard/` — All EvoGuard UI components (nav, hero, dashboard, score model, architecture, pitch, security, pricing, footer)
- `src/components/evoguard/dashboard/` — Interactive dashboard panels (risk overview, evidence explorer, historical patterns, provenance, review comments, sidebar)
- `src/lib/evoguard/mock-data.ts` — Realistic mock PR analyses, evidence, historical patterns, pricing, threat model, pitch deck

### Tech stack

- Next.js 16 (App Router, Turbopack)
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui (New York)
- Lucide icons
- Jetbrains Mono + Geist font pairing

---

## Roadmap (90-day pilot)

| Phase | Days | Focus |
|---|---|---|
| 1. Evidence MVP | 1–30 | GitHub App, PR ingestion, diff/commit analysis, static analysis, CI collection, basic report, audit log |
| 2. Historical Compatibility | 31–60 | Revert/rollback detection, pattern mining, dependency compatibility, evidence-linked comments, score calibration |
| 3. Production Pilot | 61–90 | Policy engine, dashboard, outcome tracking, pilot with real repos, security hardening, go/no-go |

---

## Pricing

| Tier | Price | Best for |
|---|---|---|
| Free | $0 / public repo | OSS maintainers, small experiments |
| Team | $29 / active dev / mo | Teams shipping AI-assisted code daily |
| Enterprise | Custom | Regulated industries, on-prem, CMK |

No customer data is used for model training without explicit, revocable consent.

---

## License

Proprietary — © 2026 EvoGuard. All rights reserved.

## Links

- Live demo dashboard — see the `#dashboard` section of the deployed site
- Pitch deck (5 slides, Thiel framing) — see the `#pitch` section
- Working threat model — see the `#security` section (top 6 of 19 tracked threats)
