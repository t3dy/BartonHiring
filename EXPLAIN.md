# Technical Terms Explained — Barton Springs Moving Site Migration

Plain-English glossary for everything that's come up while moving your site off
SiteGround. Organized in the order it matters, not alphabetically.

## The big picture

Your live website (bartonspringsmoving.com) is actually two separate things duct-taped
together on one server:

1. **The frontend** — the pages people see (home, quote form, residential, commercial,
   FAQ, team, etc.). Built with a tool called **Astro**, then "exported" into plain HTML
   files ahead of time (see "static site" below).
2. **The backend** — code that runs on the server to handle logins, save quote requests,
   calculate pricing, and store data. Written in **PHP**, talking to a **database**.

Both currently live on **SiteGround**, a traditional web host (like a filing cabinet plus
a computer that runs your PHP code). We're moving both pieces to more modern homes:
**Vercel** for the frontend/backend code, **Supabase** for the database.

## Frontend terms

- **Astro** — the software framework the current site's pages were built with. Similar
  purpose to WordPress, but it's a coding framework, not a point-and-click CMS — pages are
  built by a developer, not edited in a dashboard.
- **Static site / static export** — instead of building each page freshly every time a
  visitor loads it, Astro generated plain `.html` files once, in advance. These files sit
  on the server and get served as-is — fast, cheap, simple. The tradeoff: to change page
  content you edit and re-generate the files, you can't just log in and type into a box
  (unless a CMS is added on top later).
- **Vite / React** — the tools the *other* project (the gamified quote wizard we've been
  building in the `BartonHiring` repo) uses. Different toolkit than Astro, same general
  idea: code that gets "built" into files a browser can run.

## Backend / server terms

- **PHP** — a programming language built specifically for websites; still widely used.
  Your current quote form, login, and pricing logic are all written in PHP files
  (`auth.php`, `quotes.php`, etc.) that live on the SiteGround server.
- **API / API endpoint** — a URL that isn't a webpage for humans, it's a door for code to
  talk to code. When you submit the quote form, the page doesn't save the data itself —
  it calls an API endpoint (`quotes.php`) which does the actual saving. Each PHP file we
  found (`auth.php`, `quotes.php`, `pricing.php`, etc.) is one of these doors.
- **Serverless function** — the *replacement* for those PHP files on the new platform.
  Instead of one PHP file always running on one server, Vercel spins up a tiny bit of code
  on-demand, only when someone actually calls that endpoint, then shuts it back down. Same
  job (save a quote, check a login), different, more modern hosting model — you don't pay
  for or maintain a server sitting idle 24/7.
- **Backend / database credentials (`config.php`)** — the file holding the password and
  connection details your PHP code uses to reach the database. Correctly, it lives outside
  the public folder so nobody browsing the website can stumble onto it. We had to read
  this (over a secure connection) to know what database to copy.

## Database terms

- **Database** — where all the actual data lives: every quote request, every job
  application, every review, every admin login. Not files you can open and read directly —
  you query it with a specialized language.
- **PostgreSQL ("Postgres")** — the specific *kind* of database your site uses. There are
  several database engines (MySQL, Postgres, etc.); yours happens to be Postgres, which
  matters because the new home (Supabase) is Postgres-native — nice coincidence, avoids a
  file-format conversion.
- **Schema vs. data** — "schema" is the *shape* of the database (table names, column names,
  what type each field is — like the empty spreadsheet with headers). "Data" is the actual
  rows filled in (the real quotes, real customer names). We copied both: schema first
  (safe, no personal info in it), then the real data (67 contact form leads, 35 move
  quotes, 115 Google reviews, etc.) — all successfully, matching row-for-row.
- **Table** — one "sheet" within the database. Yours has 8: `move_quotes`, `contact_leads`,
  `job_applications`, `admin_users`, `google_reviews`, `google_business_info`,
  `media_files`, `rate_settings`.
- **Supabase** — the new home for your database. It's essentially "Postgres, hosted, with
  a nice dashboard," run by a different company than SiteGround. You already had an account
  from other work, so we created a new project there specifically for Barton Springs Moving.

## Hosting / deployment terms

- **Vercel** — the new home for the website code itself (both the pages and the
  serverless functions). Built especially for deploying frontend frameworks like Astro/
  React quickly, and it plugs directly into GitHub.
- **GitHub / repo (repository)** — where your website's code is stored and versioned
  (think: Google Docs version history, but for code). `BartonHiring` is the name of the
  repo we're using. "Connecting" it to Vercel means: every time code changes in GitHub,
  Vercel automatically rebuilds and republishes the live site.
- **Environment variables ("env vars")** — settings/secrets (like the new database
  password) that the code needs, but that shouldn't be hard-typed into the code itself
  (especially since your GitHub repo is *public*). Instead they're configured privately in
  the Vercel dashboard, and the code reads them at run-time.
- **DNS / domain cutover** — the phone-book lookup that turns "bartonspringsmoving.com"
  into "which server do I actually go to." Right now it points at SiteGround. The final
  step of this whole migration is repointing it at Vercel instead — this is the one truly
  hard-to-reverse step (until it propagates, some visitors could briefly see the old site,
  some the new), so I'll confirm with you explicitly before doing that, once everything is
  tested and working.

## Security / access terms

- **SSH** — a secure, password-free way to remotely log into a server and run commands,
  using a matched pair of cryptographic keys instead of typing a password. Used here to
  safely read the old database and copy it over, without ever exposing the actual password
  on screen.
- **SSH key (public/private key pair)** — two matching digital keys. The public one gets
  handed to SiteGround (safe to share, that's the point). The private one stays only on
  the machine doing the work and is what actually proves identity. I generated a temporary
  pair just for this migration.
- **Secrets / credentials** — passwords, API keys, anything that grants access. General
  rule I'm following throughout: these never get committed into the public GitHub repo,
  and I avoid printing them in chat/logs more than necessary.
- **SmartMoving** — the CRM (customer management software) Matt already pays for. We found
  the old backend has an integration key for it, meaning quotes or reviews likely sync
  there automatically. The new backend needs to preserve that connection so nothing breaks
  on Matt's side.

## Why this all matters for you day-to-day

- You (or I) will manage the site through **GitHub + Vercel** going forward instead of
  SiteGround's file manager — meaning changes are made in code, reviewed, then
  automatically published, rather than editing files directly on a live server.
- The **database** now lives in Supabase, which has a much friendlier dashboard for
  browsing quotes/leads/reviews than clicking through SiteGround's file manager ever did.
- Nothing customer-facing should change in how the site *looks or works* — this is a
  foundation swap, not a redesign (aside from the Login-nav fix and the new quote wizard).
