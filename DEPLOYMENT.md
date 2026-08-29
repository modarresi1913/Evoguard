# EvoGuard — Deployment Guide

> **Self-host EvoGuard on your own Vercel account, with your own token, in under 2 minutes.**

This guide walks you through deploying the EvoGuard demo dashboard to Vercel. The demo requires **no environment variables** — all mock data is bundled in the repo.

---

## 🚀 Quick deploy (one-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmodarresi1913%2FEvoguard&project-name=evoguard&repository-name=Evoguard&env=NEXT_TELEMETRY_DISABLED&envDescription=No+environment+variables+required+for+the+demo&demo-title=EvoGuard+Demo&demo-description=Evidence-driven+AI+code+review+dashboard)

### What the one-click button does

1. **Forks** `modarresi1913/Evoguard` to your GitHub account
2. **Creates** a new Vercel project linked to your fork
3. **Deploys** using **your own Vercel account, your own token, your own quota**
4. **Returns** a live URL like `evoguard-xxxxx.vercel.app`

> ✅ No tokens shared with the original repo
> ✅ No fork can touch the upstream
> ✅ You can rebrand, customize, and sell the fork as your own (subject to license)

---

## 📋 Prerequisites

- A **GitHub account** (free tier OK)
- A **[Vercel account](https://vercel.com/signup)** (free Hobby tier is sufficient for the demo)
- The repository forked to your GitHub account (the one-click button handles this)

---

## 🔧 Manual deployment options

### Option A: Vercel Dashboard (recommended for first-time)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your forked repository: `YOUR_USERNAME/Evoguard`
3. Vercel will auto-detect Next.js — review the settings:
   - **Framework preset**: Next.js
   - **Build command**: `bun run build` (auto-detected from `vercel.json`)
   - **Output directory**: `.next` (auto-detected)
   - **Install command**: `bun install --frozen-lockfile` (auto-detected)
4. Click **Deploy**

The deployment will complete in ~2 minutes. Vercel will provide:
- A preview URL: `evoguard-xxx.vercel.app`
- A production URL (after assigning a domain)

### Option B: Vercel CLI (local terminal)

```bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/Evoguard.git
cd Evoguard

# 2. Install Vercel CLI (one-time)
npm install -g vercel

# 3. Login (opens browser for OAuth)
vercel login

# 4. Deploy preview (creates a unique URL)
vercel

# 5. Deploy to production (assigns production domain)
vercel --prod
```

### Option C: GitHub Actions (automated CI/CD)

The repository includes a GitHub Actions workflow (`.github/workflows/vercel-deploy.yml`) that automatically deploys:

- **Preview** on every PR — posts a comment with the preview URL
- **Production** on every push to `main`

To enable this, add these secrets to your repository (**Settings → Secrets and variables → Actions → New repository secret**):

| Secret name | How to get it |
|---|---|
| `VERCEL_TOKEN` | Create at [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel project → Settings → General → "Org ID" |
| `VERCEL_PROJECT_ID` | Vercel project → Settings → General → "Project ID" |

After adding the secrets, push to `main` and watch the workflow deploy automatically.

---

## 🌐 Custom domain

To assign a custom domain (e.g. `evoguard.yourcompany.com`):

1. Go to your Vercel project → **Settings → Domains**
2. Add your domain
3. Update your DNS provider:
   - **Apex domain** (e.g. `yourcompany.com`): add an `A` record pointing to `76.76.21.21`
   - **Subdomain** (e.g. `evoguard.yourcompany.com`): add a `CNAME` record pointing to `cname.vercel-dns.com`
4. Wait for DNS propagation (5-30 minutes)
5. Vercel will auto-provision a TLS certificate

---

## 🔐 Environment variables

### For the demo dashboard

**No environment variables required.** All mock data is bundled in `src/lib/evoguard/mock-data.ts`. See [`.env.example`](./.env.example) for the full list of variables the production backend will need.

### For the production backend (when available)

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Production only |
| `GITHUB_APP_ID` | GitHub App ID | Production only |
| `GITHUB_PRIVATE_KEY` | GitHub App private key | Production only |
| `GITHUB_WEBHOOK_SECRET` | GitHub webhook secret | Production only |
| `LLM_API_KEY` | LLM provider API key | Production only |
| `LLM_PROVIDER` | `openai` \| `anthropic` \| `self-hosted` | Production only |
| `ENCRYPTION_KEY` | Per-tenant encryption key (CMK) | Production only |

---

## ⚡ Performance

Vercel automatically:
- Enables **Edge Network CDN** (285+ locations)
- **Brotli** compresses responses
- Optimizes images via `next/image`
- Deploys to **multiple regions** (configured in `vercel.json`)

The `vercel.json` config deploys to:
- `iad1` — Washington, D.C. (US East)
- `sfo1` — San Francisco (US West)
- `fra1` — Frankfurt (EU)

---

## 🛡️ Security headers

The `vercel.json` file configures these security headers on all routes:

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |

---

## 🔄 CI/CD overview

```
Developer opens PR
        │
        ▼
┌──────────────────────────┐
│  GitHub Actions CI        │
│  - Lint & Type-check      │
│  - Build                  │
│  - Secret scan (trufflehog)│
│  - CodeQL analysis        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Vercel Preview           │
│  Deploy (per PR)          │
│  + PR comment with URL    │
└──────────┬───────────────┘
           │
   Reviewer merges
           │
           ▼
┌──────────────────────────┐
│  Vercel Production        │
│  Deploy (on main push)   │
└──────────────────────────┘
```

---

## 🚨 Troubleshooting

### Build fails with `Cannot find module 'X'`

```bash
# Ensure bun.lock is up to date
bun install
git add bun.lock
git commit -m "chore: update bun.lock"
git push
```

### Build fails with TypeScript errors

Run lint locally — it will surface type errors before CI does:

```bash
bun run lint
```

### Vercel deploy succeeds but page is blank

Check the browser console (F12). Most likely causes:
- Missing environment variables (only if using the production backend)
- Hydration mismatch (check `suppressHydrationWarning` on `<html>` in `layout.tsx`)

### Vercel CLI deploy fails with auth error

```bash
vercel logout
vercel login
```

If that doesn't work, try:

```bash
vercel whoami        # Check current user
vercel switch <team> # Switch to correct team
```

### `404: DEPLOYMENT_NOT_FOUND` on `evoguard.vercel.app`

This happens when you visit `evoguard.vercel.app` but no project named `evoguard` exists in **your** Vercel account. Either:
- Click the one-click deploy button above to create it
- Or visit your own deployment URL: `evoguard-<your-suffix>.vercel.app` (shown in your Vercel dashboard)

### GitHub Actions deploy fails with `VERCEL_TOKEN not set`

You need to add the three secrets described in [Option C](#option-c-github-actions-automated-cicd). Without them, the workflow will skip gracefully (you'll see a `notices` entry on the run).

---

## 📊 Monitoring

After deployment, Vercel provides:
- **Analytics** — page views, top pages, web vitals (Core Web Vitals)
- **Speed Insights** — real user monitoring for performance
- **Logs** — function logs, build logs, runtime logs

Enable Analytics in your Vercel project → **Analytics** tab.

---

## 🆘 Getting help

- [Vercel documentation](https://vercel.com/docs)
- [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying)
- [Open a discussion](https://github.com/modarresi1913/Evoguard/discussions)
- [Open an issue](https://github.com/modarresi1913/Evoguard/issues)

---

## 📋 Quick reference — deployment commands

```bash
# One-click deploy (browser)
# → Click the button at the top of this file

# CLI deploy (terminal)
git clone https://github.com/YOUR_USERNAME/Evoguard.git
cd Evoguard
npm install -g vercel
vercel login
vercel --prod

# Local development
bun install
bun run dev

# Build & lint
bun run lint
bunx next build
```

---

<div align="center">

**[⬆ Back to top](#)** · **[← Back to README](./README.md)**

</div>
