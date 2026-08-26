# Barton Springs Moving — Website Handover Guide

**Last Updated:** August 25, 2026  
**For:** Matthew Barton & Next Webmaster  
**Project URL:** https://bartonspringsmoving.com/  
**GitHub:** https://github.com/t3dy/BartonHiring  
**Vercel:** https://vercel.com/tedhand-2181s-projects/barton-hiring  
**Supabase:** https://supabase.com/dashboard/project/wbrxzhlrigwdhokzwulo

---

## Overview

The Barton Springs Moving website is now fully operational with:

- 🌍 **Marketing site** (`/`) — Mirror of bartonspringsmoving.com
- 💰 **Quote system** (`/quote/`) — Two calculator options (interactive or simple form)
- 📋 **Admin dashboard** (`/admin/`) — View submitted quotes
- 📚 **Hiring guide** (`/hiring-guide/`) — 51 hiring actions mapped
- 🎓 **Lessons** (`/lessons/`) — Claude Code training content

All pages are live on Vercel at **bartonspringsmoving.com** (or vercel-assigned domain if custom domain not configured).

---

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Navigate to `http://localhost:5173` (or the assigned port) to see all pages:
- `/` — Marketing site
- `/quote/` — Quote calculator (entry page with two options)
- `/admin/` — Quote dashboard
- `/hiring-guide/` — Hiring guide
- `/lessons/` — Lessons site

---

## Deployment to Vercel

### First-Time Setup

1. **Connect your GitHub account** to Vercel (already done)
2. **Project already configured** — no additional setup needed
3. **Environment variables** — Need to add (see section below)

### To Deploy

```bash
# Push to GitHub main branch
git push origin main

# Vercel auto-deploys on push to main
# Check deployment at: https://vercel.com/tedhand-2181s-projects/barton-hiring
```

### Environment Variables (Critical)

Add these in Vercel project settings → Environment Variables:

```
VITE_SUPABASE_URL=https://wbrxzhlrigwdhokzwulo.supabase.co
VITE_SUPABASE_ANON_KEY=<get-from-supabase-dashboard>
```

**To get Supabase keys:**
1. Go to https://supabase.com/dashboard/project/wbrxzhlrigwdhokzwulo
2. Settings → API → Copy "Anon" key and Project URL
3. Paste into Vercel environment variables
4. Redeploy

**Important:** Without these variables, quotes will still work but only save to browser localStorage (lost if user clears data).

---

## Quote Management

### Where Quotes Are Stored

**Primary:** Supabase database (persistent, backed up)  
**Fallback:** Browser localStorage (temporary, per-device)

### Viewing Submitted Quotes

1. Go to `/admin/`
2. All quotes are displayed in a table
3. Click any row to see full details
4. Status: new, contacted, scheduled, completed, cancelled

### Accessing Quotes in Supabase

1. Go to https://supabase.com/dashboard/project/wbrxzhlrigwdhokzwulo
2. Table: `quotes`
3. Can filter, search, export, or manage directly in dashboard

### Quote Data Structure

Each quote includes:
- Contact info (name, phone, email)
- Move details (property type, size, distance, boxes)
- Service details (packing, loading, etc.)
- Promo codes applied
- Estimated cost range (low-high)
- Submission timestamp
- Status & internal notes

---

## The Quote System: Two Calculators

### 1. Interactive Quote Builder (Gamified)

**URL:** `/quote/?mode=interactive`  
**Time to complete:** ~5 minutes  
**User experience:** Playful, step-by-step

Features:
- Interactive map of Austin neighborhoods
- Visual item selector with emojis
- Salamander crew picker
- Box stack estimator
- Promo code support (ONTHELAKE5, BARTON50)

**When to recommend:** Customers who enjoy interactive experiences or want detailed estimates

### 2. Simple Quote Form (Classic)

**URL:** `/quote/?mode=classic`  
**Time to complete:** ~3 minutes  
**User experience:** Traditional form, straightforward

Features:
- Simple dropdown/checkbox form
- Basic move details
- Instant price calculation
- Promo code support

**When to recommend:** Customers in a hurry or who prefer traditional forms

### Entry Page

**URL:** `/quote/`  
Shows both options side-by-side. Users choose their preferred experience.

---

## Marketing Site Updates

The marketing site at `/` is a **static mirror** of the live bartonspringsmoving.com site. To update it:

### Option 1: Update via Vercel (Easiest)

1. Get the updated HTML/content from the live site
2. Place files in the `public/` directory (if static) or migrate to Astro
3. Commit and push to GitHub
4. Vercel auto-deploys

### Option 2: Use Astro (Recommended Long-term)

The site is built with Astro. To edit:

1. The Astro site is in `.astro/` (if configured) or imported
2. To modify: Edit `.astro` files, images, etc.
3. Run `npm run build` locally
4. Push to GitHub

### Key Files

- `index.html` — Main homepage (mirrored from live site)
- `public/images/` — Hero images, logos
- `/residential/`, `/commercial/`, `/contact-us/`, etc. — Service pages

---

## Admin Dashboard

### Accessing the Dashboard

1. Go to `/admin/`
2. All quotes load automatically
3. Search, filter, or sort by status

### Managing Quotes

**Change status:**
- Click quote row → "Status" dropdown → Select new status
- Options: new, contacted, scheduled, completed, cancelled

**Add internal notes:**
- Click quote → "Internal Notes" field
- Use for crew assignments, follow-up details, etc.

**Export/Report:**
- Currently: Manual copy-paste into spreadsheet
- Future: Add CSV export button if needed

---

## Environment Configuration

### .env.local (for development)

Create this file in the project root:

```
VITE_SUPABASE_URL=https://wbrxzhlrigwdhokzwulo.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

**Without these:** App still works, but quotes only save to localStorage.

### Vercel Environment Variables

Same as above — set in Vercel dashboard → Settings → Environment Variables → Add

---

## Troubleshooting

### Quotes not saving to Supabase

**Check:**
1. Environment variables set in Vercel?
2. Supabase project active and accessible?
3. Browser console for errors (F12 → Console tab)

**Fix:**
- Verify Supabase keys in Vercel dashboard
- Test in browser dev tools: `fetch('https://your-project.supabase.co/rest/v1/quotes')`
- Quotes will still save to localStorage as fallback

### Quote calculator not loading

**Check:**
1. Is `/quote/` page accessible?
2. Any JavaScript errors in console (F12)?
3. Does page show entry screen (choose between calculators)?

**Fix:**
- Clear browser cache (Cmd+Shift+Delete or Ctrl+Shift+Delete)
- Try incognito window
- Check build: `npm run build` should complete without errors

### Vercel deployment failed

**Check:**
1. GitHub push successful?
2. Any build errors in Vercel logs?
3. Environment variables set?

**Fix:**
- Go to https://vercel.com/tedhand-2181s-projects/barton-hiring
- Deployments tab → Check logs for errors
- Fix errors locally, push again

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4 |
| **Build** | Vite 8 |
| **Hosting** | Vercel (serverless) |
| **Database** | Supabase (PostgreSQL) |
| **Icons** | Lucide React |
| **Storage** | Fallback: browser localStorage |

### Project Structure

```
barton-hiring/
├── src/
│   ├── QuoteEntry.tsx         # Entry page (choose calculator)
│   ├── QuoteWizard.tsx        # Interactive gamified wizard
│   ├── SimpleCalculator.tsx   # Classic form calculator
│   ├── AdminDashboard.tsx     # Quote management dashboard
│   ├── quoteStore.ts          # Data persistence (Supabase + localStorage)
│   ├── App.tsx                # Hiring guide app
│   └── assets/                # Images (salamander logo, etc.)
├── index.html                 # Marketing site root
├── quote/                     # Quote calculator entry point
├── admin/                     # Admin dashboard entry point
├── hiring-guide/              # Hiring guide entry point
├── lessons/                   # Lessons site entry point
├── public/                    # Static assets (images, fonts)
├── dist/                      # Built files (generated by npm run build)
├── vite.config.ts             # Vite configuration
├── vercel.json                # Vercel routing configuration
├── package.json               # Dependencies & scripts
└── README.md                  # Project overview
```

---

## Common Tasks

### Add a promo code

**File:** `src/QuoteWizard.tsx` (line ~84) and `src/SimpleCalculator.tsx` (line ~51)

```typescript
const PROMOS: Record<string, { kind: 'pct' | 'flat'; value: number }> = {
  ONTHELAKE5: { kind: 'pct', value: 5 },      // 5% off
  BARTON50: { kind: 'flat', value: 50 },      // $50 off
  NEWCODE: { kind: 'pct', value: 10 },        // Add new codes here
};
```

Then:
```bash
npm run build
git commit -am "Add NEWCODE promo"
git push origin main
```

### Update pricing

**For interactive wizard:** `src/QuoteWizard.tsx` (search `BASE_SIZE_PRICING`)  
**For simple form:** `src/SimpleCalculator.tsx` (search `PRICING_BASE`)

Update the dollar amounts, rebuild, commit, and push.

### Update Austin areas/neighborhoods

**File:** `src/QuoteWizard.tsx` (search `TOWNS`)

Add or modify the town list with coordinates and tier.

### Update crew recommendations

**File:** `src/QuoteWizard.tsx` (search `recommendedCrew`)

Adjust the function to change how crew size is calculated based on move size, items, etc.

---

## Customer Support

### Phone support

**Number:** (512) 641-0949  
**Hours:** Monday–Friday 7:30 AM–7 PM, Saturday 7:30 AM–6 PM, Sunday 7:30 AM–5 PM

### Email support

**Address:** matt@bartonspringsmoving.com

### Handling quote inquiries

1. Customer submits quote via website
2. Quote appears in `/admin/` dashboard
3. Status → "contacted" (when you reach out)
4. Call or email customer within 24 hours
5. Status → "scheduled" (once move is booked)
6. After move → Status → "completed"

---

## Performance & Monitoring

### Page Load Times

Typical:
- Homepage: < 2s
- Quote page: < 1.5s
- Admin: < 1s

**To optimize:**
- Keep image sizes under 100KB (use webp format)
- Minimize JavaScript bundle (currently ~600KB gzipped)

### Monitoring

- **Vercel analytics:** https://vercel.com/tedhand-2181s-projects/barton-hiring/analytics
- **Google Analytics:** Configure in Vercel project settings
- **Error tracking:** Check Vercel logs for 500 errors

---

## Future Enhancements

### Easy wins (< 1 hour each)

- [ ] Add SMS notification when quote received
- [ ] Export quotes to CSV
- [ ] Add customer review section to homepage
- [ ] Create "FAQ" page
- [ ] Add "get quote" CTA button on every page

### Medium effort (2-4 hours each)

- [ ] Integrate with scheduling system (Calendly/Google Calendar)
- [ ] Email confirmations with auto-generated quote PDFs
- [ ] Customer portal to track move status
- [ ] A/B test quote calculator variants

### Larger projects (4+ hours each)

- [ ] Move all content to CMS (Strapi, Contentful)
- [ ] Mobile app for crew (schedule, photos, signatures)
- [ ] Booking system (online scheduling)
- [ ] Customer reviews integration (Google, Yelp)

---

## Security & Compliance

### Data Privacy

- Quotes stored in Supabase (encrypted at rest)
- Customer data never exposed in URLs
- Add privacy policy & terms to homepage if needed

### Access Control

- Admin dashboard currently has **no login** (add password if sensitive)
- Supabase API keys are anon-level (limited permissions)
- Never commit `.env.local` to GitHub

### Backup & Recovery

**Supabase automatic backups:**
- Retention: 7 days
- Manual backups available in Supabase dashboard

---

## Version History

| Date | Changes | Author |
|------|---------|--------|
| 2026-08-25 | Initial handover: Quote system (two calculators), Admin dashboard, Supabase integration | Claude/Ted |
| 2026-07-28 | Added Vercel API backend, reworked hiring guide accordion | Claude/Ted |
| Earlier | Gamified quote wizard, salamander mascot, branding | Earlier dev team |

---

## Questions?

If something isn't clear:

1. Check the code comments (start in `src/quote-main.tsx`)
2. Review git commit messages: `git log --oneline`
3. Ask your team or contact the original developer

Good luck! 🚀

---

**Salamanders forever!** 🦎
