# EvoGuard — Deployment Guide

This guide walks you through deploying the EvoGuard demo dashboard to Vercel.

## 🚀 Quick deploy (one-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmodarresi1913%2FEvoguard&project-name=evoguard&repository-name=Evoguard)

Click the button above to fork the repository and deploy it to Vercel in one step.

## 📋 Prerequisites

- A GitHub account
- A [Vercel account](https://vercel.com/signup) (free tier is sufficient)
- The repository forked to your GitHub account

## 🔧 Manual deployment

### Option A: Vercel Dashboard (recommended for first-time)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your forked repository: `YOUR_USERNAME/Evoguard`
3. Vercel will auto-detect Next.js — review the settings:
   - **Framework preset**: Next.js
   - **Build command**: `bun run build` (auto-detected)
   - **Output directory**: `.next` (auto-detected)
   - **Install command**: `bun install --frozen-lockfile`
4. Click **Deploy**

The deployment will complete in ~2 minutes. Vercel will provide:
- A preview URL: `evoguard-xxx.vercel.app`
- A production URL (after assigning a domain): `evoguard.app` (or your custom domain)

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# From the repository root
cd Evoguard

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Option C: GitHub Actions (automated)

The repository includes a GitHub Actions workflow (`.github/workflows/vercel-deploy.yml`) that automatically deploys:

- **Preview** on every PR — posts a comment with the preview URL
- **Production** on every push to `main`

To enable this, add these secrets to your repository (Settings → Secrets and variables → Actions):

| Secret name | How to get it |
|---|---|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens → Create Token |
| `VERCEL_ORG_ID` | Vercel project → Settings → General → Org ID |
| `VERCEL_PROJECT_ID` | Vercel project → Settings → General → Project ID |

## 🌐 Custom domain

To assign a custom domain (e.g. `evoguard.app`):

1. Go to your Vercel project → **Settings → Domains**
2. Add your domain
3. Update your DNS provider:
   - For apex domains: add an `A` record pointing to `76.76.21.21`
   - For subdomains: add a `CNAME` record pointing to `cname.vercel-dns.com`
4. Wait for DNS propagation (5-30 minutes)
5. Vercel will auto-provision a TLS certificate

## 🔐 Environment variables

The demo dashboard does not require any environment variables to run. All mock data is bundled in `src/lib/evoguard/mock-data.ts`.

When the production backend lands, you will need:

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Production only |
| `GITHUB_APP_ID` | GitHub App ID | Production only |
| `GITHUB_PRIVATE_KEY` | GitHub App private key | Production only |
| `GITHUB_WEBHOOK_SECRET` | GitHub webhook secret | Production only |
| `LLM_API_KEY` | LLM provider API key | Production only |
| `LLM_PROVIDER` | `openai` \| `anthropic` \| `self-hosted` | Production only |
| `ENCRYPTION_KEY` | Per-tenant encryption key (CMK) | Production only |

## ⚡ Performance

Vercel automatically:
- Enables Edge Network CDN (285+ locations)
- Compresses responses with Brotli
- Optimizes images via `next/image`
- Deploys to multiple regions (configured in `vercel.json`)

The `vercel.json` config deploys to:
- `iad1` — Washington, D.C. (US East)
- `sfo1` — San Francisco (US West)
- `fra1` — Frankfurt (EU)

## 🛡️ Security headers

The `vercel.json` file configures the following security headers on all routes:

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |

## 🔄 CI/CD overview

```
Developer opens PR
        │
        ▼
┌──────────────────────┐
│  GitHub Actions CI    │
│  - Lint & Type-check  │
│  - Build              │
│  - Secret scan        │
│  - CodeQL analysis    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Vercel Preview      │
│  Deploy (per PR)     │
│  + PR comment        │
└──────────┬───────────┘
           │
   Reviewer merges
           │
           ▼
┌──────────────────────┐
│  Vercel Production   │
│  Deploy (on main)    │
└──────────────────────┘
```

## 🚨 Troubleshooting

### Build fails with `Cannot find module 'X'`

Run `bun install` locally to ensure `bun.lock` is up to date, then commit and push.

### Build fails with TypeScript errors

Run `bun run lint` locally — it will surface type errors before CI does.

### Vercel deploy succeeds but page is blank

Check the browser console. Most likely causes:
- Missing environment variables (if using production backend)
- Hydration mismatch (check `suppressHydrationWarning` on `<html>`)

### Vercel CLI deploy fails with auth error

```bash
vercel logout
vercel login
```

## 📊 Monitoring

After deployment, Vercel provides:
- **Analytics** — page views, top pages, web vitals (Core Web Vitals)
- **Speed Insights** — real user monitoring for performance
- **Logs** — function logs, build logs, runtime logs

Enable Analytics in your Vercel project → **Analytics** tab.

## 🆘 Getting help

- [Vercel documentation](https://vercel.com/docs)
- [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying)
- [Open a discussion](https://github.com/modarresi1913/Evoguard/discussions)
- [Open an issue](https://github.com/modarresi1913/Evoguard/issues)

---

<div align="center">

**[⬆ Back to top](#)** · **[← Back to README](./README.md)**

</div>
