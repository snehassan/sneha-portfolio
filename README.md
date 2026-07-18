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

## Custom domain — `sneha.is-a.dev` (free)

Free developer subdomain from [is-a.dev](https://github.com/is-a-dev/register).
Hosting stays free too: Vercel's Hobby tier supports custom domains.

**Order matters** — their PR checklist requires the site to already be live.

1. **Deploy to Vercel first** (see above).
2. Vercel → project → **Settings → Domains** → add `sneha.is-a.dev`.
   Vercel will say it's waiting on DNS — that's expected.
3. Submit the is-a.dev PR. A branch is already prepared at
   [`snehassan/register@add-sneha`](https://github.com/snehassan/register/tree/add-sneha)
   containing `domains/sneha.json`:
   ```json
   {
       "owner": { "username": "snehassan", "email": "snehahassan7920@gmail.com" },
       "records": { "CNAME": "cname.vercel-dns.com" }
   }
   ```
   Open the PR here:
   https://github.com/is-a-dev/register/compare/main...snehassan:register:add-sneha?expand=1

   Fill out their template fully — tick every box, and **include a live link
   AND a screenshot** (PRs without a screenshot are closed with no questions).
4. Once merged, DNS publishes within minutes and Vercel issues HTTPS
   automatically.

Then update `metadataBase` in `app/layout.tsx` to `https://sneha.is-a.dev` so
Open Graph/SEO URLs are correct.

### Backup option
`eu.org` is also free and gives a shorter `sneha.eu.org`, but approval is manual
and takes weeks. Worth submitting in parallel if you want it.
