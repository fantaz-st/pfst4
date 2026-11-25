# TODO

What's left before pfst4 can replace pfst.unist.hr. Background and rules are
in `CLAUDE.md`; this is only the open work. Tick items off or delete them as
they're done.

## Bugs

- [ ] `src/lib/i18n/siteLinks.js:36` — `href: "tel+:38521619399"` is not a valid
      phone link; should be `tel:+38521619399`.
- [ ] `src/lib/i18n/siteLinks.js:37` — `href: "info@pfst.hr"` is missing `mailto:`,
      so it links to a relative page.

## WordPress (editors)

- [ ] Post "Ocean Hackaton 2025" (ID 4820): change the slug `4820` to e.g.
      `ocean-hackaton-2025`. A purely numeric slug crashes `nodeByUri`, so
      `/novosti/4820/` is a 404 and every build logs the error.
- [ ] Create all inner pages — what's in WordPress today is only a sample.
      `old-routes.txt` is the task list; reuse the old slugs and parents so
      no redirects are needed.
- [ ] Reassign the 11 posts in "Bez kategorije" to a real category.
- [ ] Fix the typo in the goal term `odgovornja-potrosnja-i-proizvodnja`
      (name and slug), then remove the workaround in `src/features/news/ciljevi.js`.
- [ ] Replace "- Katedra za…" leading dashes in accordion summaries with
      nested `details` blocks.
- [ ] Fill in Yoast titles and meta descriptions, at least for the main
      sections (hub-card descriptions come from them).
- [ ] Create the privacy policy page (HR + EN), then set `PRIVACY_HREF` in
      `src/features/consent/CookieConsent.jsx`.
- [ ] Konzultacije: the page's table block needs the CSS class
      `konzultacije` to render as the searchable list.

## Vercel

- [ ] Environment variables: `SCEDULY_USER`, `SCEDULY_INSTITUTION_ID`,
      `SCEDULY_PASSWORD`, `SCEDULY_LOCATION`, `CRON_SECRET`.
- [ ] Check the revalidate secret is named `WP_REVALIDATE_SECRET` (the
      local `.env` had `PFST_REVALIDATE_SECRET`, which the code never reads).
- [ ] After the first deploy, check the cron `/api/cron/sceduly` appears
      under Settings → Cron Jobs and its first run returns `synced: true`.
- [ ] Firewall: add a rate-limit rule for `/api/search`. The limit in the
      route is per instance, so only this is a hard limit.
- [ ] Production: `SITE_NOINDEX` unset; staging/preview: `true`.

## Information needed from the faculty

All marked `TODO` in `src/lib/i18n/siteLinks.js` (and mirrored in
`src/lib/seo.js:275`):

- [ ] Webmail URL
- [ ] Dean's office phone and e-mail
- [ ] Student office phone and e-mail
- [ ] Facebook page URL (then sync the JSON-LD in `seo.js`)
- [ ] What teaching type "T" means in Sceduly (`src/lib/timetable.js:11`,
      currently guessed as "Terenska nastava")
- [ ] Homepage photos for `public/images/` (`features/home/HomePage.jsx:39`,
      `features/home/Statement.module.css:52`)

## Design

- [ ] Add the Raspored, Konzultacije and cookie consent designs to
      `design/` (the consent code refers to a "PFST — Kolačići" canvas that
      isn't there). Until then these screens have no source of truth.

## Features not built yet

- [ ] English timetable — the English "Timetable" link points at the
      Croatian page (`siteLinks.js:57`).

## Before launch

- [ ] Run `scripts/route-diff.mjs` once the content is in, and add the
      redirects it suggests to `next.config.mjs`.
- [ ] Spot-check metadata (title, description, canonical, hreflang) on a
      page, a post, a hub page and `/en/`.
- [ ] Accessibility pass (WCAG 2.1 AA): keyboard through header, search
      overlay, cookie dialog, gallery viewer, Raspored and Konzultacije;
      check reduced motion with the OS setting on.
- [ ] Repo-wide grep for old-system leftovers (Archivo, `#0f385c`,
      `#058cc4`, `neutral-*`, `accent-100…900`, `badge-*`, `shadow-*`) —
      clean as of 2026-11-25.
