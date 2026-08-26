# Deployment Guide — Barton Springs Moving

## Current Deployment

- **Live URL:** https://bartonspringsmoving.com/
- **Vercel Project:** https://vercel.com/tedhand-2181s-projects/barton-hiring
- **GitHub Repo:** https://github.com/t3dy/BartonHiring
- **Database:** Supabase (wbrxzhlrigwdhokzwulo)

---

## Deploy a Change

### 1. Make your changes locally

```bash
# Make edits to files
# Test with: npm run dev
# Check: npm run build (should have zero errors)
```

### 2. Commit to Git

```bash
git add .
git commit -m "Your clear change description here"
```

### 3. Push to GitHub

```bash
git push origin main
```

### 4. Vercel auto-deploys

- Vercel watches the `main` branch
- Deployment starts automatically
- Takes 1-3 minutes
- Check status: https://vercel.com/tedhand-2181s-projects/barton-hiring/deployments

---

## Environment Variables (Critical!)

### Set in Vercel Dashboard

1. Go to https://vercel.com/tedhand-2181s-projects/barton-hiring
2. **Settings** → **Environment Variables**
3. Add these two:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://wbrxzhlrigwdhokzwulo.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Get from Supabase dashboard |

### Get Supabase Anon Key

1. Go to https://supabase.com/dashboard/project/wbrxzhlrigwdhokzwulo
2. **Settings** → **API**
3. Copy "Anon" public key
4. Paste into Vercel

### Without these variables

- ✅ Quotes still work (save to browser localStorage)
- ❌ Quotes only persist on same device/browser
- ❌ No data backup or sync

---

## Vercel Build Configuration

**Current setup (already configured):**

- **Framework:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist/`
- **Redirect rules:** Configured in `vercel.json`

**vercel.json:**

```json
{
  "rewrites": [
    { "source": "/api/:name/", "destination": "/api/:name" }
  ]
}
```

This allows serverless functions in `/api/` to work properly.

---

## Multi-Page App Routing

The site has multiple entry points (MPA — multi-page app):

| Route | Entry Point | Renders |
|-------|-----------|---------|
| `/` | `index.html` | Marketing site |
| `/quote/` | `quote/index.html` | Quote calculator (entry + both modes) |
| `/admin/` | `admin/index.html` | Quote dashboard |
| `/hiring-guide/` | `hiring-guide/index.html` | Hiring guide |
| `/lessons/` | `lessons/index.html` | Lessons content |

**Build process:**
1. `npm run build` bundles each entry point separately
2. Vercel serves each from the correct path
3. All assets (CSS, JS, images) are in `dist/assets/`

---

## Checking Deployment Status

### In Vercel UI

1. https://vercel.com/tedhand-2181s-projects/barton-hiring
2. **Deployments** tab shows all deploys
3. Click any deployment to see:
   - Build logs
   - File changes
   - Status (ready, building, error)

### Check Live Site

```bash
# Test each route
curl https://bartonspringsmoving.com/
curl https://bartonspringsmoving.com/quote/
curl https://bartonspringsmoving.com/admin/
```

All should return `200 OK`.

---

## Rollback a Deployment

If a deployment breaks the site:

1. Go to Vercel Deployments tab
2. Find the last working deployment
3. Click **Redeploy**
4. Confirm

Takes 1-2 minutes to rollback.

---

## Local Testing Before Deploy

```bash
# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
# Opens http://localhost:5173

# Test all routes
# /        → Marketing site
# /quote/  → Quote entry (choose calculator)
# /admin/  → Quote dashboard
# /hiring-guide/ → Hiring guide
# /lessons/      → Lessons

# Build for production (must pass with no errors)
npm run build

# Preview production build locally
npm run preview
# Opens http://localhost:4173
```

---

## Custom Domain Setup

**Current:** bartonspringsmoving.com (likely already configured)

**To verify:**
1. Vercel Dashboard → Settings → Domains
2. Should show `bartonspringsmoving.com` as the primary domain
3. DNS records pointing to Vercel

**To change domain:**
1. Vercel Dashboard → Settings → Domains → Remove old domain
2. Add new domain
3. Follow Vercel DNS instructions
4. Takes 5-30 minutes to propagate

---

## Monitoring & Debugging

### Check Vercel Logs

1. Vercel Dashboard → Click latest deployment
2. **Build** tab shows build output
3. **Logs** tab shows runtime errors

### Browser Console Errors

Open live site, press F12 (Dev Tools) → Console tab

Common issues:
- `fetch failed` — Supabase not configured
- `Cannot read property 'x'` — Data structure mismatch
- `Unexpected token` — Corrupted JavaScript

### Fix & Redeploy

```bash
# Local: reproduce error
npm run dev
# Check console in browser

# Fix the issue in code
# Rebuild locally to verify
npm run build

# Commit and push
git add .
git commit -m "Fix: [description]"
git push origin main

# Vercel redeploys automatically
```

---

## Database Backups

**Supabase automatic backups:**

1. Go to https://supabase.com/dashboard/project/wbrxzhlrigwdhokzwulo
2. Settings → Backups
3. Shows automatic daily backups (7-day retention)
4. Can manually trigger backups anytime

**To restore from backup:**
1. Supabase Dashboard → Backups tab
2. Click backup date → "Restore"
3. Confirms restoration (check logs)

---

## Performance Optimization

### Current Bundle Sizes

After build:
- Quote JS: ~44KB (gzipped: 12KB)
- Admin JS: ~22KB (gzipped: 5.7KB)
- Total JS: ~600KB (gzipped: 60KB)

### Optimization opportunities

- [ ] Split route bundles further (load only needed code)
- [ ] Lazy-load Supabase client
- [ ] Optimize images (convert to webp)
- [ ] Remove unused dependencies

---

## Common Errors & Fixes

### "Cannot read property 'environment'"

**Cause:** Missing environment variables

**Fix:**
1. Vercel Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy

### "fetch failed" when submitting quote

**Cause:** Supabase not configured or network error

**Fix:**
1. Check environment variables set
2. Verify Supabase project is active
3. Clear browser cache, try again
4. Fall back to localStorage (automatic)

### "Build failed: Cannot find module"

**Cause:** Missing dependency or import path typo

**Fix:**
1. `npm install` locally
2. `npm run build` — check for errors
3. Fix imports/dependencies
4. Push to GitHub

### Deployment takes too long (> 5 min)

**Cause:** 
- Large dependencies
- Network issues
- Build configuration issue

**Fix:**
1. Check Vercel logs for "slow" steps
2. Ensure `.gitignore` excludes `node_modules/`
3. Verify `vercel.json` is minimal

---

## Security Checklist

- [ ] Environment variables **not** committed to git
- [ ] `.env.local` in `.gitignore`
- [ ] Supabase keys never exposed in client code (except Anon key)
- [ ] No hardcoded passwords or API keys
- [ ] Admin dashboard has minimal access (could add auth later)

---

## Support & Troubleshooting

### Check these first

1. **Browser:** Clear cache (Cmd/Ctrl + Shift + Delete)
2. **Network:** Try incognito/private window
3. **Build:** Run `npm run build` locally — any errors?
4. **Vercel:** Check Deployments tab for build errors
5. **Supabase:** Verify project is active and keys are correct

### Debug script

```bash
# Run locally to isolate issue
npm install
npm run build
npm run preview

# Open browser dev tools (F12)
# Check Console tab for errors
```

### Still stuck?

1. Check Vercel logs: https://vercel.com/tedhand-2181s-projects/barton-hiring/deployments
2. Review recent commits: `git log --oneline -10`
3. Test Supabase connectivity: Visit https://supabase.com/dashboard/project/wbrxzhlrigwdhokzwulo
4. If production is down, rollback last deployment

---

## Deployment Checklist

Before committing & pushing:

- [ ] Changes tested locally with `npm run dev`
- [ ] Build passes with `npm run build` (zero errors)
- [ ] No console warnings in preview (`npm run preview`)
- [ ] Quotes save correctly (check admin dashboard)
- [ ] Promo codes work
- [ ] All routes accessible (`/`, `/quote/`, `/admin/`, etc.)
- [ ] Images load correctly
- [ ] Forms submit without errors
- [ ] Mobile responsive (test on phone or dev tools)

---

**Ready to deploy? Push to main and Vercel handles the rest!** 🚀
