# Contributing to EvoGuard

Thanks for your interest in contributing to EvoGuard! 🛡️

This document describes how to contribute to the EvoGuard repository — currently the **demo dashboard and marketing site** for the EvoGuard product. The production backend (Evidence Store, Risk Scoring Engine, Policy Engine, LLM Explanation Layer) is proprietary and lives in a separate repository.

## 🚧 Current status

EvoGuard is in **MVP / design-partner pilot phase**. We are:

- ✅ Accepting bug reports and feature requests via Issues
- ✅ Looking for design partners (see [Design Partner Application](https://github.com/modarresi1913/Evoguard/issues/new?template=design-partner.yml))
- ✅ Open to high-quality external contributions to the demo dashboard
- ❌ Not yet accepting large architectural changes (please open a Discussion first)

## 📜 Code of Conduct

Be excellent to each other. Be direct, not personal. Disagree about ideas, not people. We follow the [Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) in spirit.

## 🛡️ Core principles — read first

Before contributing, please read the [Core Principles](./README.md#-core-principles) section of the README. EvoGuard is built on six inviolable principles. If your contribution would violate any of them, it will not be merged.

In particular:

1. **The Pull Request is the unit of work** — features that operate on individual lines or symbols will not be accepted.
2. **The LLM explains; it never decides alone** — features that let the LLM mutate evidence or auto-merge PRs will not be accepted.
3. **Provenance is probabilistic** — features that claim to detect AI-generated code with certainty will not be accepted.
4. **No patch auto-merges for score alone** — features that bypass human approval will not be accepted.

## 🛠️ Development setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/) (recommended) or npm/pnpm
- Git

### Install and run

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/Evoguard.git
cd Evoguard

# Add upstream remote
git remote add upstream https://github.com/modarresi1913/Evoguard.git

# Install dependencies
bun install

# Start the dev server
bun run dev
```

The app will be available at <http://localhost:3000>.

### Available scripts

```bash
bun run dev      # Start dev server (port 3000)
bun run build    # Production build
bun run lint     # ESLint check
```

## 🔄 Workflow

### 1. Find or open an issue

Before starting work, check the [open issues](https://github.com/modarresi1913/Evoguard/issues). If your idea is not listed, open a new issue using the appropriate template:

- [🐛 Bug Report](https://github.com/modarresi1913/Evoguard/issues/new?template=bug-report.yml)
- [✨ Feature Request](https://github.com/modarresi1913/Evoguard/issues/new?template=feature-request.yml)
- [🔒 Security Report](https://github.com/modarresi1913/Evoguard/issues/new?template=security-report.yml)
- [🤝 Design Partner Application](https://github.com/modarresi1913/Evoguard/issues/new?template=design-partner.yml)

### 2. Fork and branch

```bash
# Create a feature branch from main
git checkout -b feat/your-feature-name
```

Use a descriptive branch name prefixed with the type:

- `feat/` — new feature
- `fix/` — bug fix
- `docs/` — documentation only
- `chore/` — build, CI, tooling
- `refactor/` — code restructure
- `style/` — formatting, whitespace, no logic change

### 3. Make your changes

Follow the [style guide](#-style-guide) below. Keep PRs focused — one feature or fix per PR.

### 4. Verify locally

```bash
# Lint
bun run lint

# Build
bun run build

# Manual check
bun run dev
# Open http://localhost:3000 — verify dashboard tabs, pitch carousel, mobile menu
```

### 5. Commit — Conventional Commits

EvoGuard follows [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <subject>

<body>

<footer>
```

Examples:

```text
feat(dashboard): add severity filter to evidence explorer

fix(hero): correct gradient direction on Safari

docs(readme): add comparison section vs CodeRabbit

chore(ci): add CodeQL workflow

refactor(provenance): extract confidence band helper
```

### 6. Push and open PR

```bash
git push -u origin feat/your-feature-name
```

Open a PR against `main` from your fork. Fill out the [PR template](./.github/PULL_REQUEST_TEMPLATE.md).

## 🎨 Style guide

### TypeScript

- Strict mode enabled — no `any` without an explanatory comment
- Use `interface` for object shapes, `type` for unions and intersections
- Prefer named exports over default exports (except for Next.js pages)
- Use `as const` for literal-typed arrays and objects

### React / Next.js

- App Router only — no Pages Router
- `'use client'` directive at the top of files that use hooks or browser APIs
- Server components by default — only opt into `'use client'` when needed
- Props typed with explicit interfaces
- No `useEffect` for data fetching — use server components or React Query

### Tailwind CSS

- Use Tailwind utility classes — no inline `style={}` props unless dynamic
- Use the `cn()` helper from `@/lib/utils` for conditional classes
- Dark theme is the default — every component must look right in dark mode
- Mobile-first: write mobile styles first, then `sm:`, `md:`, `lg:` overrides

### File naming

- Components: `kebab-case.tsx` (e.g. `risk-overview.tsx`)
- Hooks: `use-<name>.ts`
- Utils: `kebab-case.ts`
- Mock data: `mock-data.ts` (single source of truth in `src/lib/evoguard/`)

### Mock data

All demo data lives in [`src/lib/evoguard/mock-data.ts`](./src/lib/evoguard/mock-data.ts). If you add a new feature, add the corresponding mock data there — do not scatter mock data across components.

### Accessibility (mandatory)

- Semantic HTML (`main`, `header`, `nav`, `section`, `article`, `footer`)
- ARIA labels for icon-only buttons
- Keyboard navigation must work for every interactive element
- Color contrast ≥ 4.5:1 for text, ≥ 3:1 for large text and UI components
- Visible focus rings

### Responsive design (mandatory)

- Mobile-first: design for 390px width, then enhance for larger
- Touch targets ≥ 44px
- Test at: 390px, 768px, 1024px, 1440px

## ✅ PR checklist

Before opening a PR, confirm:

- [ ] `bun run lint` passes
- [ ] `bun run build` succeeds
- [ ] Manual test on desktop (1440px) and mobile (390px)
- [ ] No new console errors
- [ ] All interactive elements still work
- [ ] Commit messages follow Conventional Commits
- [ ] No secrets, `.env`, or local DB files committed
- [ ] README updated if behavior changed
- [ ] PR template filled out

## 🧪 Testing

We do not yet have automated tests for the demo dashboard. Until we do:

- Manual testing is required (see checklist above)
- Use [Agent Browser](https://github.com/vercel-labs/agent-browser) or Playwright for verification
- Visual regression: take a screenshot before and after your change

## 🔒 Security

Found a vulnerability? Please see the [Security section of the README](./README.md#-security--privacy) or open a [Security Report](https://github.com/modarresi1913/Evoguard/issues/new?template=security-report.yml).

**Do not file public issues for critical, actively-exploitable vulnerabilities.** Email **security@evoguard.app** instead.

## 📜 License

By contributing to EvoGuard, you agree that your contributions will be licensed under the same proprietary license that covers the project. See the [License section of the README](./README.md#-license).

## 💬 Questions?

- [GitHub Discussions](https://github.com/modarresi1913/Evoguard/discussions) — for questions and ideas
- [GitHub Issues](https://github.com/modarresi1913/Evoguard/issues) — for bugs and feature requests
- Email: **hello@evoguard.app** — for design partner inquiries

---

<div align="center">

Built with ❤️ for engineering teams who refuse to merge blind.

[⭐ Star this repo](https://github.com/modarresi1913/Evoguard) · [🐛 Report a bug](https://github.com/modarresi1913/Evoguard/issues/new?template=bug-report.yml) · [💡 Request a feature](https://github.com/modarresi1913/Evoguard/issues/new?template=feature-request.yml)

</div>
