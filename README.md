# Sneha Hassan — Portfolio

Next.js (App Router) portfolio built from the design handoff. Calm typeset
landing that links to colorful inner pages, live Medium feed, an editable
"scribbles" links feed, a hidden Blocky Flight mini-game, and 5 easter eggs.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
```

## Structure

```
app/
  page.tsx            Landing (pulls latest 3 Medium posts)
  writing/            Full live Medium feed
  scribbles/          "Links I'm into" feed  ← edit data/scribbles.ts
  projects/           Projects grid
  experience/         Timeline (dark)
  about/              About + coffee easter egg
  game/               Blocky Flight
components/            Client bits: toast, easter eggs, name/coffee, game
lib/medium.ts         Medium RSS fetch + parse (revalidates hourly)
data/scribbles.ts     Your scribbles — the file you'll edit most
public/Resume.pdf     PLACEHOLDER — replace with your real resume
```

## Things you'll want to fill in

- **Resume:** replace `public/Resume.pdf` with your real PDF (same filename).
- **Project images:** drop screenshots into `public/` and swap the placeholder
  `<div className="card-img placeholder">` blocks in `app/projects/page.tsx`
  for `<img className="card-img" src="/your-shot.png" ...>`. Same for the
  landing thumbnails in `app/page.tsx` (`.thumb.placeholder`).
- **Project links:** the `writeup → / repo → / demo →` links currently point to
  `#`. Update the `link` fields in `app/projects/page.tsx`.
- **Scribbles:** add/reorder entries in `data/scribbles.ts` (newest on top).
- **Medium handle:** set in `lib/medium.ts` (`MEDIUM_HANDLE`), currently
  `@snehassan123`.

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo. Framework is
   auto-detected as Next.js. Click **Deploy**. No env vars needed.

## Custom domain (the short, no-"vercel" URL)

1. Buy a domain — e.g. `snehahassan.com` or `sneha.dev`
   (Cloudflare Registrar or Namecheap, ~$10–12/yr, at-cost on Cloudflare).
2. Vercel → your project → **Settings → Domains** → add the domain.
3. Vercel shows the DNS records to add. At your registrar:
   - Apex (`snehahassan.com`): **A** record → `76.76.21.21`
   - `www`: **CNAME** → `cname.vercel-dns.com`
   (Vercel will show the exact current values — use those.)
4. Wait for DNS to propagate (minutes to a couple hours). Vercel issues the
   HTTPS cert automatically.

Once the domain is live, update `metadataBase` in `app/layout.tsx` to it so
Open Graph/SEO URLs are correct.
