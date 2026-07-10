# Finding Jobs — Demand Generation for Barton Springs Moving

Matt's constraint has flipped: he's no longer crew-limited, he's **lead-limited**. He has
staff capacity sitting idle between jobs. Everything below is organized by how fast it can
fill that capacity, and what I (as web dev/AI support) can build to make each one easier
than it would be manually.

## The core loop: one video, everywhere

Matt's instinct is right and it's the highest-leverage move available: shoot once, distribute
everywhere. The workflow:

1. **Shoot one piece of raw footage per week.** Doesn't need to be polished — a move day
   time-lapse, a "what we wrapped today" walkthrough, a crew intro, a customer thank-you,
   a Q&A answering something a customer actually asked ("do you move pianos?", "what if it
   rains?"). Phone camera is fine.
2. **Post the long version to YouTube first.** YouTube is searchable (people search
   "movers near me" and "Austin moving company reviews" on YouTube too) and it's the best
   source file for everything downstream.
3. **Auto-repurpose to every other platform.** This is the "get it connected" part. Options,
   cheapest to most automated:
   - **Manual cross-post (free):** download from YouTube Studio, re-upload natively to
     Instagram Reels, TikTok, Facebook Reels, YouTube Shorts. Takes ~10 min/video. Fine for
     the first month while Matt is learning what performs.
   - **Repurpose.io** ($) — connect once, auto-clips and posts to IG/TikTok/FB/YouTube
     Shorts/LinkedIn/X every time a new YouTube video goes up. This is the direct answer
     to "if we get it connected."
   - **OpusClip / Klap** ($) — AI finds the best 15–60 sec moments in a longer video and
     cuts vertical clips automatically, with captions burned in. Good if videos run long
     (a full move time-lapse, a longer Q&A).
   - **Metricool or Buffer** ($) — scheduling + cross-posting + analytics in one place,
     useful once Matt wants to see what's actually driving calls.
   - I can wire up whichever tool he picks (most have simple OAuth connect flows) and,
     if useful, build a tiny dashboard that pulls view/engagement numbers next to quote
     volume so we can see if posting correlates with leads.

### Video ideas that double as SEO/trust content
- "What movers actually charge in Austin" (transparency content ranks well and pre-sells price)
- Neighborhood guides — "Moving to South Congress / Mueller / Cedar Park" — ranks for
  hyper-local searches and is easy to batch-produce
- Behind-the-scenes crew content — humanizes the brand, cheap to shoot, good for retention/hiring too
- Customer testimonial clips (ask at the end of a 5-star job — see review funnel below)
- "How we wrap a piano / handle stairs / pack a kitchen" — practical, shareable, ranks on YouTube search

## Quick wins (days, not weeks)

- **Google Local Services Ads (Google Guaranteed).** Pay-per-lead, not pay-per-click —
  you only pay when someone actually calls/messages. This is the single highest-ROI paid
  channel for local service businesses and directly fills idle crew capacity. I can help
  set up the profile and background-check paperwork.
- **Review funnel, automated.** The dashboard already has a `google_reviews` /
  `google_business_info` sync (I saw this during the SiteGround work) — I can extend
  `quotes.php`/the new backend to auto-text a review link 2 hours after a job is marked
  complete. More reviews → better Local Services Ads ranking → more organic map-pack visibility.
- **Referral program for customers, not just movers.** Memory shows Matt already runs
  partner discount codes (e.g. Windsor on the Lake). Formalize the same idea for past
  customers: "$25 off your next move + $25 for the friend you send us." Cheap, and the
  infrastructure (promo codes) already partially exists in the quote wizard.
- **Off-season / non-residential diversification.** Nov–Feb is slow for household moves.
  Target: storage facility partnerships (they refer overflow move-outs), office/commercial
  relocations, senior living move-management (higher margin, less seasonal), real estate
  agent referral relationships (stagers and agents constantly need move-out help).

## Medium-effort, compounding

- **Local SEO content on the actual site.** Since the site is already Astro + has real
  page routes, adding a few `/blog/` or `/areas/austin-neighborhood/` pages targeting
  "movers in [neighborhood]" is straightforward for me to build and it compounds over time
  unlike ads.
- **Realtor & property manager partnerships.** A one-page "preferred mover" flyer/landing
  page (I can build this) that realtors and apartment leasing offices hand to
  new residents — apartment turnover is a steady, non-seasonal source of small jobs that
  are easy for existing crews to slot in.
- **Nextdoor Business Page.** Free, hyperlocal, and moving companies get a lot of organic
  word-of-mouth traffic there specifically — worth Matt spending 15 min/week on.
- **Email/SMS to past customers.** The `move_quotes` table already has names/emails/move
  dates — a simple "it's been a year since your move, need help with anything (storage
  cleanout, office move, know someone moving?)" email is nearly free to send and a warm list.

## Where I can plug in directly

- Build the review-request automation (ties into the backend work already in progress)
- Build a lightweight "refer a friend" flow in the quote wizard
- Build 1–2 neighborhood/SEO landing pages
- Wire up whichever repurposing tool Matt picks (Repurpose.io is the simplest "connect once" option)
- Build a simple lead-source dashboard (which channel — social, Google Ads, referral,
  Nextdoor — is actually producing quotes) once we have a few weeks of data flowing through
  the new backend

## Open questions for Matt

- Budget appetite for Local Services Ads / paid lead gen, even a small test ($200–300/mo)?
- Who is he already getting referrals from informally (realtors, property managers, past
  customers) that we could formalize?
- Which platform does he actually want to lead with — YouTube, Instagram, or TikTok? (Pick
  one home base, repurpose out from there, rather than trying to be native-great everywhere.)
