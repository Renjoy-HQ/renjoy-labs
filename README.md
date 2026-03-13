# Renjoy Labs

AI thought leadership hub for VRM operators. Built with Next.js, deployed on Vercel at `labs.renjoy.com`.

## Pages

- `/` — Landing page (essay hub, projects, newsletter, contact)
- `/essays/stake-your-claim` — Essay 1: Stake Your Claim
- `/essays/the-mulrooney-play` — Essay 2: The Mulrooney Play
- `/essays/the-sutter-trap` — Essay 3: The Sutter Trap

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Renjoy Labs"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/renjoy-labs.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `renjoy-labs` GitHub repo
3. Framework preset will auto-detect **Next.js**
4. Click **Deploy**

### 3. Set up custom domain

1. In Vercel project → **Settings** → **Domains**
2. Add `labs.renjoy.com`
3. Vercel will give you a CNAME record to add in Cloudflare:
   - **Type:** CNAME
   - **Name:** labs
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** DNS only (gray cloud) — important for Vercel SSL
4. Wait for DNS propagation (~1-5 min with Cloudflare)
5. Vercel will auto-provision SSL

### 4. Cloudflare DNS note

Since your nameservers are on Cloudflare, make sure the `labs` CNAME is set to **DNS only** (gray cloud, not orange proxied). Vercel needs to terminate SSL itself. If you proxy through Cloudflare, you'll get redirect loops.

## SEO / AEO

- `public/robots.txt` — allows all crawlers
- `public/sitemap.xml` — all pages listed
- `public/llms.txt` — AI crawler discoverability file with key concepts and essay summaries
- JSON-LD structured data on landing page (Organization, Person, Article, FAQPage schemas)
- Per-page OpenGraph metadata via Next.js layout files

## Future: Supabase + Beehiiv Integration

Newsletter signup forms are currently UI-only. To wire them up:

1. Create `newsletter_subscribers` table in Supabase (project: `jqoikdpshyjivouzxqyf`)
2. Add Supabase client to the project
3. POST email + source to Supabase on form submit
4. Edge Function or Zapier syncs new rows to Beehiiv API

Contact form follows the same pattern — POST to a `contact_inquiries` Supabase table.
