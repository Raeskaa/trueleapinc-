# TrueLeap Deployment Guide

## Infrastructure Overview

| Component | Value |
|-----------|-------|
| **Platform** | Cloudflare Workers |
| **Cloudflare Account** | Sandip's — `b01357b51e0ceb9e37e2bdf82bbcbc34` |
| **Worker Name** | `trueleap-inc` |
| **Zone** | `trueleapinc.com` (Zone ID: `f2e8adbf061e2a861b6feba81a43f394`) |
| **GitHub Repo** | `Trueleap/trueleap-inc` |
| **Framework** | Astro 5.17 + `@astrojs/cloudflare` adapter |
| **CMS** | Keystatic 0.5.48 (GitHub mode, `branchPrefix: 'content/'`) |
| **Access Control** | Cloudflare Access (App ID: `f008e844-6011-4c77-ba7b-774f38055e52`) |

---

## Environments

| Environment | Domain | Wrangler Env | Deploys From |
|-------------|--------|-------------|--------------|
| **Dev** | `dev.trueleapinc.com` | `--env dev` | `main` branch (via GitHub Actions) |
| **Preview** | `dev-preview.trueleapinc.com` | `--env preview` | Manual (`npx wrangler deploy --env preview`) |
| **Production** | `trueleapinc.com` | _(not configured yet)_ | _(site not ready)_ |

### Dev (`dev.trueleapinc.com`)

- Primary development environment
- Auto-deploys on every push to `main` via GitHub Actions
- Keystatic CMS editor accessible at `/keystatic`
- Admin dashboard at `/admin`
- Protected by Cloudflare Access

### Preview (`dev-preview.trueleapinc.com`)

- Preview environment for testing before dev
- Manual deployment only
- Protected by Cloudflare Access (entire domain)

---

## DNS Configuration

Both dev and preview domains use **AAAA records** pointing to `100::` (the standard Cloudflare Workers routes proxy address — NOT a CNAME).

| Record | Type | Name | Content |
|--------|------|------|---------|
| Dev | AAAA | `dev` | `100::` |
| Preview | AAAA | `dev-preview` | `100::` |

> **Why AAAA `100::`?** Workers routes require the domain to be proxied through Cloudflare. AAAA `100::` is the Cloudflare-recommended dummy address for this purpose. CNAME to `*.workers.dev` does NOT work for Workers routes.

---

## Secrets & Environment Variables

### Cloudflare Workers Secrets

Set via `npx wrangler secret put <NAME> --env <ENV>`:

| Secret | Purpose | Where Set |
|--------|---------|-----------|
| `GITHUB_TOKEN` | GitHub PAT for Keystatic auth + admin API endpoints | Each worker env separately |

```bash
# Set for dev
npx wrangler secret put GITHUB_TOKEN --env dev

# Set for preview
npx wrangler secret put GITHUB_TOKEN --env preview
```

The GitHub token is a **non-expiring PAT** with repo scope on `Trueleap/trueleap-inc`.

### GitHub Actions Secrets

Set in repo Settings > Secrets and variables > Actions:

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Wrangler authentication for deployment |

---

## Deployment

### Automatic (GitHub Actions)

Every push to `main` triggers `.github/workflows/deploy.yml`:

1. Checkout code
2. `npm ci`
3. `npm run build`
4. `npx wrangler deploy --env dev`

### Manual

```bash
# Build
npm run build

# Deploy to dev
npx wrangler deploy --env dev

# Deploy to preview
npx wrangler deploy --env preview
```

### Wrangler Config (`wrangler.toml`)

```toml
name = "trueleap-inc"
account_id = "b01357b51e0ceb9e37e2bdf82bbcbc34"
main = "./dist/_worker.js/index.js"
compatibility_date = "2026-02-04"
compatibility_flags = ["nodejs_compat"]

[assets]
binding = "ASSETS"
directory = "./dist"

[[r2_buckets]]
binding = "IMAGES_BUCKET"
bucket_name = "trueleap-images"

[observability]
enabled = true

[env.dev]
routes = [
  { pattern = "dev.trueleapinc.com/*", zone_name = "trueleapinc.com" },
]
[[env.dev.r2_buckets]]
binding = "IMAGES_BUCKET"
bucket_name = "trueleap-images"

[env.preview]
routes = [
  { pattern = "dev-preview.trueleapinc.com/*", zone_name = "trueleapinc.com" },
]
[[env.preview.r2_buckets]]
binding = "IMAGES_BUCKET"
bucket_name = "trueleap-images"
```

> **Note:** R2 bucket bindings must be repeated in each `[env.*]` section — Wrangler does not inherit top-level bindings.

---

## Cloudflare Access

A single Cloudflare Access application protects all admin and CMS routes across all domains.

**App ID:** `f008e844-6011-4c77-ba7b-774f38055e52`

### Protected Paths

| Domain | Path |
|--------|------|
| `dev.trueleapinc.com` | `/admin` |
| `dev.trueleapinc.com` | `/api/admin/*` |
| `dev.trueleapinc.com` | `/keystatic/*` |
| `dev.trueleapinc.com` | `/api/keystatic/*` |
| `dev-preview.trueleapinc.com` | `/*` (entire domain) |

---

## GitHub Actions Workflows

### 1. `deploy.yml` — Deploy to Cloudflare Workers

- **Trigger:** Push to `main`
- **Action:** Build + `wrangler deploy --env dev`

### 2. `content-pr.yml` — Auto-create PR from Content Branches

- **Trigger:** Push to `content/**` branches
- **Action:** Creates a PR to `main` if one doesn't exist (title: `Content: {branch-name}`)

### 3. `preview-comment.yml` — Post Admin Link on Content PRs

- **Trigger:** PR opened/synchronized against `main` from `content/*` branches
- **Action:** Posts a comment with links to the CMS editor and Admin Dashboard

---

## Application Architecture

### Routes

| Route | Type | Purpose |
|-------|------|---------|
| `/admin` | SSR | Admin dashboard — branch/PR management |
| `/keystatic/*` | SSR | Keystatic CMS editor |
| `/api/admin/create-branch` | POST | Create `content/{name}` branch from main HEAD |
| `/api/admin/delete-branch` | POST | Delete a `content/*` branch (rejects if open PR) |
| `/api/admin/merge-pr` | POST | Merge a PR (squash merge) |
| `/api/admin/rebase-pr` | POST | Rebase a PR branch onto main |
| `/api/keystatic/*` | SSR | Keystatic API (GitHub proxy) |

### Middleware (`src/middleware.ts`)

1. **Cookie Injection:** Sets `keystatic-gh-access-token` cookie from `GITHUB_TOKEN` env var on all `/keystatic` and `/api/keystatic` routes — enables Keystatic GitHub auth without user login
2. **Redirect:** `/keystatic` or `/keystatic/` → 302 to `/admin`
3. **Read-Only Main:** `/keystatic/branch/main*` → injects CSS banner + full-page shield overlay (blocks pointer events; GitHub branch protection is the real enforcement)

### Keystatic Branch URL Encoding

Keystatic uses `encodeURIComponent` for branch names in URLs. The `/` in `content/branch-name` is encoded as `%2F`:

```
/keystatic/branch/content%2Fmy-branch
```

> **Important:** The encoding is `%2F`, NOT `~2F`. All admin dashboard links and API responses use `%2F`.

---

## Content Workflow

1. **Create branch** via `/admin` dashboard → calls `POST /api/admin/create-branch`
2. Branch `content/{name}` is created from main HEAD
3. Redirect to Keystatic editor at `/keystatic/branch/content%2F{name}`
4. Edit content in Keystatic → commits to `content/{name}` branch
5. First push triggers `content-pr.yml` → creates PR to main
6. PR appears on admin dashboard with status (Ready / Conflict / Checking)
7. **Rebase** if conflicts → `POST /api/admin/rebase-pr`
8. **Publish** when ready → `POST /api/admin/merge-pr` (squash merge)
9. Push to main triggers `deploy.yml` → auto-deploy to dev

---

## Troubleshooting

### DNS not resolving

```bash
# Flush local DNS cache
sudo systemctl restart systemd-resolved
# or
sudo resolvectl flush-caches

# Verify resolution
dig dev.trueleapinc.com AAAA
```

### Keystatic "branch does not exist"

- Ensure URLs use `%2F` encoding (not `~2F`)
- Verify the branch actually exists on GitHub
- Check `GITHUB_TOKEN` secret is set on the correct worker environment

### Wrangler deploy issues

```bash
# Verify account
npx wrangler whoami

# Deploy with verbose logging
npx wrangler deploy --env dev --log-level debug
```

### R2 bucket not found

Ensure `[[env.{name}.r2_buckets]]` is defined in `wrangler.toml` for each environment. Top-level bindings are NOT inherited.
