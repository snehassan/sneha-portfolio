# Sneha Hassan, Portfolio

Next.js (App Router) portfolio. Calm typeset landing that links to colorful
inner pages, live Medium feed, an editable "scribbles" links feed, a hidden
Blocky Flight mini-game, and 5 easter eggs.

```bash
npm install && npm run dev
```

## Editing scribbles from the UI

Go to **/scribbles/admin**, enter your password, edit, and hit save. That
commits `data/scribbles.json` to GitHub and Vercel redeploys, so changes are
live in about a minute.

It needs three environment variables in **Vercel → Settings → Environment
Variables** (add them to Production, Preview, and Development):

| Variable | Value |
| --- | --- |
| `ADMIN_PASSWORD` | Any password you choose. This is what you type in the admin UI. |
| `GITHUB_TOKEN` | A **fine-grained** personal access token, scoped to *only* `snehassan/sneha-portfolio`, with **Contents: Read and write**. |
| `GITHUB_REPO` | `snehassan/sneha-portfolio` (optional, this is the default) |

Create the token at **github.com → Settings → Developer settings → Personal
access tokens → Fine-grained tokens**. Give it the shortest expiry you're
comfortable with; when it expires, saving will fail and you just issue a new
one. Do not use a classic token with full `repo` scope, it grants far more
access than this needs.

To run the admin locally, put the same values in `.env.local` (already
gitignored).

## Adding a resume

Drop the PDF in `public/resumes/` and add an entry to `data/resumes.ts`. The
one marked `primary` is what the landing page links to; the rest appear on
`/resume`.

## Custom domain

Free `sneha.is-a.dev` via [is-a.dev](https://github.com/is-a-dev/register). The
PR branch is prepared at `snehassan/register@add-sneha`. Their checklist
requires the site to be publicly reachable and a screenshot in the PR, so
deploy and turn off Vercel Deployment Protection first.

After the domain is live, update `metadataBase` in `app/layout.tsx`.
