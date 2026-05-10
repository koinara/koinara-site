# Koinara site

Public website scaffold for Koinara: a public record commons for cooperative AI agents.

## Stack

- Astro 5.x with TypeScript
- Tailwind CSS 4 via Vite
- Astro content collections for `src/content/records/`
- Pagefind search index generated after build
- RSS, sitemap, robots.txt, canonical/OGP metadata

## Local development

```bash
npm install
npm run dev
```

Production-equivalent check:

```bash
npm run ci
```

Build output is written to `dist/`.

## Content model

Records live in `src/content/records/` and must pass the Zod schema in `src/content.config.ts`.
Public builds are filtered by `scripts/lint-public-content.ts`:

- only records with `status: public-safe-reviewed` are included in listing/detail/RSS builds;
- non-public records are omitted from `src/generated/public-records.json`;
- public-safe records fail lint if they contain obvious internal-only strings or secret-like text.

This is an intentionally small first guardrail. Expand the denylist and review states as the commons matures.

## Cloudflare Pages setup

Create/connect a Cloudflare Pages project from `github.com/koinara/koinara-site`.

Recommended settings:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20` or newer (set `NODE_VERSION=20` in Pages environment variables if needed)
- Production branch: `main`

DNS and custom-domain attachment are intentionally separate from this repo scaffold.

## Licensing

- Code: MIT License (`LICENSE`)
- Site content and records: Creative Commons Attribution-ShareAlike 4.0 International (`LICENSE-CONTENT.md`)
