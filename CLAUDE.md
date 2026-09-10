# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/portfolio site for Edie Bakker, a ghostwriter and editor. Static site built with
Astro 7 and Tailwind CSS v4, deployed to Netlify. No backend, no database, no client-side
framework — every page renders to static HTML at build time.

## Commands

```
astro dev --background     # start dev server (http://localhost:4321) — always use background mode
astro dev stop             # stop it
astro dev status           # is it running?
astro dev logs             # tail its output
astro build                # production build to ./dist/
astro preview              # serve the built ./dist/ locally
astro check                # type-check .astro files
```

Requires Node >= 22.12. There is no test suite and no separate lint step; `astro check` is
the only static verification.

## Architecture

- **Pages** (`src/pages/*.astro`) are file-based routes. Each one is a full page that imports
  `Layout`, then renders `<Header />`, a `<main id="main">`, and `<Footer />`. There is no
  per-page frontmatter/content collection — page copy (highlights, testimonials, services,
  book listings) lives inline as plain arrays in each page's frontmatter and is `.map`ped in
  the template.
- **`src/layouts/Layout.astro`** owns the `<html>`/`<head>`: it takes `title` and optional
  `description` props, sets `<title>{title} · Edie Bakker</title>`, loads Google Fonts
  (Fraunces + Inter), imports `global.css`, and renders a skip link plus `<slot />`. It does
  **not** render Header/Footer — pages do that themselves.
- **Styling** is Tailwind v4 configured entirely in CSS. `src/styles/global.css` is the only
  stylesheet; its `@theme` block defines the design tokens used site-wide:
  - fonts: `font-sans` (Inter), `font-serif` (Fraunces — used for all headings)
  - colors: `ivory`, `ink`, `clay` / `clay-dark` (accent, used for CTAs and active nav),
    `stone` / `stone-dark` (borders and section backgrounds)
  Use these token names (`text-ink`, `bg-clay`, `border-stone-dark`) rather than raw hex or
  default Tailwind palette colors. Tailwind is wired in through `@tailwindcss/vite` in
  `astro.config.mjs`, not a PostCSS/CLI config.
- **`Header.astro`** derives the active nav item from `Astro.url.pathname` (`/` matches
  exactly, others match by prefix). **`Placeholder.astro`** is a visible dashed-border stub
  for unfinished sections.
- **Images** in `src/assets/` go through `astro:assets` `<Image>` for optimization; files in
  `public/` (favicons) are served as-is.

## Contact form

`src/pages/contact.astro` uses **Netlify Forms** (`data-netlify="true"`). This only works on
a deployed Netlify build, not `astro dev`. Key wiring that must stay intact: the hidden
`<input name="form-name" value="contact">`, the matching `name="contact"` on the `<form>`,
the `bot-field` honeypot, and `action="/thank-you/"` (trailing slash matters) which routes
to `src/pages/thank-you.astro` on success.

## Deployment

Netlify, configured in `netlify.toml` (`npm run build` → publish `dist`). Pushing to `main`
deploys.

## Notes

- `AGENTS.md` mirrors the development section of this file — keep the two in sync if you
  change dev-server guidance.
- Consult https://docs.astro.build before working on routing, components, framework
  integrations, content collections, styling, or i18n.
