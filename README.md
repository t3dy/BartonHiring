# Barton Springs Moving — Complete Quote System & Hiring Guide

> **Live Site:** [https://bartonspringsmoving.com/](https://bartonspringsmoving.com/)
> **GitHub:** [github.com/t3dy/BartonHiring](https://github.com/t3dy/BartonHiring)
> **Vercel:** [vercel.com/tedhand-2181s-projects/barton-hiring](https://vercel.com/tedhand-2181s-projects/barton-hiring)
> **Database:** [Supabase](https://supabase.com/dashboard/project/wbrxzhlrigwdhokzwulo)

This repository contains the complete Barton Springs Moving website, including a production-ready quote system, admin dashboard, hiring guide, and training resources.

---

## 🚀 What's Live

### Quote System (`/quote/`)
A dual-mode moving quote calculator with persistent storage:
- **Gamified Interactive Calculator** — 5-minute experience with Austin neighborhood map, emoji item selector, crew recommendations, and Salamander mascot
- **Simple Classic Form** — 3-minute straightforward calculator with dropdown menus
- **Promo Code Support** — ONTHELAKE5, BARTON50, and more
- **Persistent Storage** — Supabase PostgreSQL with browser localStorage fallback
- **Mobile Responsive** — Works perfectly on all devices

### Admin Dashboard (`/admin/`)
Quote management and team coordination:
- View all submitted quotes in real-time
- Filter by status (new, contacted, scheduled, completed, cancelled)
- Search by customer name or email
- Add internal notes for crew assignments
- Full move details (address, date, items, distance)

### Marketing Site (`/`)
Mirror of bartonspringsmoving.com with:
- Company information
- Service overview
- Contact information
- Link to quote system
- Responsive mobile design

### Hiring Guide (`/hiring-guide/`)
Complete hiring resource covering:
- **8-stage pipeline** — Plan & Budget → Recruit → Screen → Interview → Hire → Onboard → Retain → Offboard
- **51 hiring actions** mapped across pipeline stages
- **30+ software tools** with pricing tiers
- **15+ advertising channels** with effectiveness ratings
- **Interactive cost calculator** for budgeting

### Training Resources (`/lessons/`)
Claude Code training content for business automation

---

## 📊 Quick Stats

| Feature | Status |
|---------|--------|
| **Quote System** | ✅ Production-ready, 2 calculator modes |
| **Data Storage** | ✅ Supabase + localStorage fallback |
| **Admin Dashboard** | ✅ Real-time quote management |
| **Mobile Responsive** | ✅ Fully responsive across all devices |
| **Documentation** | ✅ HANDOVER.md + DEPLOYMENT.md |
| **Hosting** | ✅ Vercel with auto-deploy from GitHub |
| **Database Backups** | ✅ Supabase 7-day retention |

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Hosting** | Vercel (serverless) |
| **Database** | Supabase (PostgreSQL) |
| **Storage Fallback** | Browser localStorage |

**Bundle Size:** ~600KB (gzipped: 60KB)  
**Page Load Time:** < 2 seconds

---

## 🚀 Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see:
- `/` — Marketing site
- `/quote/` — Quote calculator entry page
- `/admin/` — Quote dashboard
- `/hiring-guide/` — Hiring guide
- `/lessons/` — Training resources

### Environment Setup

Create `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://wbrxzhlrigwdhokzwulo.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

**To get Supabase credentials:**
1. Go to https://supabase.com/dashboard/project/wbrxzhlrigwdhokzwulo
2. Settings → API → Copy Project URL and Anon key
3. Paste into `.env.local`

**Without env vars:** The app still works, but quotes only save to browser (not persistent).

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── App.tsx                 # Main hiring guide app
├── main.tsx               # Hiring guide entry point
├── quote-main.tsx         # Quote system entry point
├── admin-main.tsx         # Admin dashboard entry point
├── QuoteEntry.tsx         # Quote calculator choice page
├── QuoteWizard.tsx        # Gamified interactive calculator
├── SimpleCalculator.tsx   # Classic form-based calculator
├── AdminDashboard.tsx     # Quote management dashboard
├── quoteStore.ts          # Supabase + localStorage integration
└── playbooks.ts           # Hiring guide data structure
```

---

## 🎮 Quote Calculator Components

### Gamified Interactive Calculator (`QuoteWizard.tsx`)
**User Experience:**
- Interactive Austin neighborhood selection with map
- Emoji-based item picker (bed, couch, dresser, etc.)
- Visual crew size recommendations
- Salamander mascot integration
- Real-time price calculation
- Promo code support

**Features:**
- 5-7 minute completion time
- Mobile-friendly touch targets
- Engaging visual design
- Automatic quote submission to Supabase

### Simple Classic Calculator (`SimpleCalculator.tsx`)
**User Experience:**
- 3-minute straightforward form
- Dropdown menus for property type, distance, services
- Instant price calculation
- Contact information capture
- Promo code support

**Features:**
- Minimal interactions
- Fast completion
- Mobile-responsive
- Same backend integration

---

## 💾 Data Storage & Persistence

### Supabase (Primary)
- PostgreSQL database hosted by Supabase
- Automatic daily backups (7-day retention)
- REST API ready for extensions
- Persistent quote storage
- Query history and analytics ready

### Browser localStorage (Fallback)
- Works offline
- Automatic fallback if Supabase unavailable
- Per-device storage
- User-transparent error handling

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **README.md** | This file — overview and quickstart |
| **LAUNCH_SUMMARY.md** | What's been built and deployed |
| **HANDOVER.md** | Complete operational guide for next webmaster |
| **DEPLOYMENT.md** | Vercel deployment and troubleshooting guide |
| **CLAUDE.md** | (Coming) Future development guidelines |

---

## 🚀 Deployment

### Auto-Deploy on Push
```bash
git push origin main
# Vercel automatically deploys (1-3 minutes)
```

Check deployment status: https://vercel.com/tedhand-2181s-projects/barton-hiring

### Manual Deployment
1. Push to main branch
2. Vercel auto-deploys
3. Verify at https://bartonspringsmoving.com

### Environment Variables in Vercel
Add to Vercel project settings:
- `VITE_SUPABASE_URL` = https://wbrxzhlrigwdhokzwulo.supabase.co
- `VITE_SUPABASE_ANON_KEY` = (from Supabase dashboard)

---

## 🧪 Testing Checklist

Before deploying changes:

- [ ] `/` loads marketing site
- [ ] `/quote/` shows both calculator options
- [ ] Gamified calculator works end-to-end
- [ ] Simple calculator works end-to-end
- [ ] Promo codes apply discounts
- [ ] Quotes save to Supabase
- [ ] Quotes appear in `/admin/` within 10 seconds
- [ ] Admin dashboard filters and searches work
- [ ] Mobile layout is responsive
- [ ] No console errors (F12 → Console)
- [ ] Forms submit without errors

---

## 📖 For Next Webmaster

**First 30 minutes:**
1. Clone this repo and run `npm install`
2. Read `HANDOVER.md` (complete operational guide)
3. Create `.env.local` with Supabase credentials
4. Run `npm run dev` and test `/quote/`
5. Check `DEPLOYMENT.md` for deployment procedures

**Ongoing maintenance:**
- Add promo codes: edit `src/QuoteWizard.tsx` and `src/SimpleCalculator.tsx`
- Update pricing: search `BASE_SIZE_PRICING` and `PRICING_BASE`
- Add Austin areas: edit `TOWNS` in `src/QuoteWizard.tsx`
- View quotes: visit `/admin/` or Supabase dashboard

---

## 🔗 Related Resources

| Resource | Link |
|----------|------|
| **Lessons Site** | [t3dy.github.io/BartonHiring/lessons](https://t3dy.github.io/BartonHiring/lessons/) |
| **Solutions Catalog** | [t3dy.github.io/BartonCatalog](https://t3dy.github.io/BartonCatalog/) |
| **Interactive Demo** | [t3dy.github.io/BizSolutionsBarton](https://t3dy.github.io/BizSolutionsBarton/) |

---

## 📊 Git History

Recent commits (full history available with `git log`):
- Latest: Simplified navigation with single "Get A Quote" link
- Gamified Quote Generator link in marketing header
- React-based quote app routing
- Dual calculators (interactive + simple)
- Supabase integration with localStorage fallback
- Marketing site mirror
- Multi-page app setup with Vite

---

## ✅ Security & Compliance

- ✅ Data encrypted at rest (Supabase)
- ✅ HTTPS/SSL on all domains (Vercel)
- ✅ No API keys in source code (environment variables)
- ✅ Anon key with minimal permissions
- ✅ Automatic daily backups
- ✅ No customer data in URLs (POST requests)
- ✅ Privacy-respecting cookie policy

---

## 🤝 Support

**For quotes questions:**
- Admin Dashboard: `/admin/`
- Supabase: https://supabase.com/dashboard/project/wbrxzhlrigwdhokzwulo

**For deployment questions:**
- Vercel: https://vercel.com/tedhand-2181s-projects/barton-hiring
- See `DEPLOYMENT.md`

**For operational questions:**
- See `HANDOVER.md`

---

Built with [Claude Code](https://claude.ai/claude-code) 🦎 **Salamanders forever!**
