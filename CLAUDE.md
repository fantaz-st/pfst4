# pfst4

Rewrite of the Faculty of Maritime Studies Split website (pfst.unist.hr).
Replaces a Next.js 12 + MUI site where posts came from WordPress but inner
pages were hardcoded React. In pfst4 **all** content lives in WordPress.

The previous attempt (pfst3) stalled because MUI reached 39 of 76 files and
forced almost everything to be a client component. Do not repeat that.

## Design — the source of truth for every visual decision

`design/` is the only source of truth for the UI. Read it before touching
any component or stylesheet:

- `design/STYLEGUIDE.md` — the rules (colour + contrast, type scale,
  spacing, radii, components, imagery, motion). **Wins over everything
  else**, including the reference pages.
- `design/tokens.css` — every value. Copied to `src/styles/tokens.css`
  with its names unchanged.
- `design/reference/home.html`, `page.html`, `opcenito.html`,
  `design/mega-menu.html`, `design/mobile-menu.html` — look and behaviour.
  Open them in a browser and match them, but don't paste their markup or
  inline styles; rebuild them as components on the tokens.
- `design/screens/*.png` — screenshots, when present.

The rules:

- **If it is not in the design, it is not on the site.** Don't add
  components, sections or UI elements the design doesn't show, and remove
  existing ones it doesn't have.
- **No raw values in components.** Colours, font sizes, spacing, radii,
  easing and durations come from `tokens.css` variables. No hex, no inline
  `style` for visual values (a CSS custom property set from data is fine).
  Alpha variants are `color-mix()` on a token, not new rgba values. The one
  exception is a component's own geometry taken from the styleguide /
  reference — control heights (52/48/44), the 38px button circle, the 7px
  eyebrow dot, optical paddings — which stays literal px in that
  component's module. If a value repeats across components, it becomes a
  token instead.
- The old visual system (Archivo, `#0f385c` / `#058cc4`, square corners,
  shadows, per-category colours) is retired. Don't reintroduce any of it,
  and don't keep aliases for old token names.
- Plus Jakarta Sans only, via `next/font/google` (self-hosted at build
  time, no runtime request to Google), one variable font file (200–800),
  subsets `latin` + `latin-ext` — without `latin-ext` č ć ž š đ fall back
  to another face.
- Accessibility is part of the design: real `<a>` / `<button>` /
  `<input>`; visible focus (2px modra ring); 44px minimum touch targets;
  text on plava is always modra — never white on plava.
- Placeholder content must look obviously fake — `[IN BRACKETS]`, `000`,
  `TODO`, `Ime Prezime` — never plausible invented figures, names or
  quotes, and always marked with a `TODO` comment. Homepage content that
  has no WordPress source yet (bento links, study programmes, CTAs) is
  hardcoded with a `TODO`.

## Stack

- Next.js 16, App Router
- JavaScript, not TypeScript (`jsconfig.json`, `@/*` -> `src/*`). There is
  no type-check step; `npm run lint` and `next build` are the checks.
- Plain CSS Modules (`.module.css`) — **no Sass**, no PostCSS plugins,
  no Tailwind. Global styles are only `styles/tokens.css`,
  `styles/globals.css` and `styles/typography.css`.
- Breakpoints are the design's, written literally (media queries can't read
  CSS variables), max-width only:
  - **1080px** — main nav → menu button, grids → 2 columns, inner-page
    sidebar stacks above the content
  - **900px** — horizontal news track → native horizontal scroll
  - **720px** — 1 column, gutter 20px
- Headless WordPress via WPGraphQL + WPGraphQL Content Blocks
- Motion: GSAP 3.15 (ScrollTrigger, SplitText) + Lenis 1.3
- The only other runtime libraries, each for one job:
  - `embla-carousel-react` (+ wheel gestures) — the homepage news slider
  - `photoswipe` — the gallery viewer (`blocks/GalleryMosaic.jsx`)
  - `html-to-image` — Raspored "save as image" (`TimetableExport`)
  - `@vercel/analytics` — page views, only with consent (`SiteAnalytics`)
  - `html-react-parser` + `isomorphic-dompurify` — block HTML
- Hosted on Vercel. `vercel.json` holds the daily Sceduly cron.

## Hard rules

- **No MUI. No Emotion. No component library.** Layout and typography are
  hand-written CSS Modules.
- **No Apollo, no urql.** Data fetching is plain `fetch` to the GraphQL
  endpoint from Server Components.
- **`"use client"` is the exception.** Expected client components: the
  header's menus (mega menu, mobile menu, floating nav), search, news
  filters and "load more", the Lenis provider, and components that exist
  to animate something; also the gallery viewer, the Konzultacije filter,
  the Raspored controls and export, cookie consent, and the
  `features/personal/` recorders. Nothing else without a reason. Block
  renderers are Server Components — a block that needs interaction hands
  its parsed data to one client child (Gallery → GalleryMosaic,
  ConsultationsBlock → Consultations).
- **GSAP and Lenis are for motion only.** They may be imported only inside
  `"use client"` components that exist to animate or scroll something.
  Never in `BlockRenderer`, any block element, or anywhere in the content
  tree. If adding GSAP to a file would make that file the first client
  component in its subtree, that is the wrong file. All motion runs inside
  `gsap.matchMedia()` so `prefers-reduced-motion: reduce` disables it (and
  Lenis), exactly as `design/STYLEGUIDE.md` §8 specifies. No other
  animation or UI library beyond the ones listed under Stack; adding one
  needs a reason written there.
- Modal dialogs keep Tab inside with `trapTab()` (`lib/focusTrap.js`),
  close on Escape, pause Lenis and return focus to the opener.
- Diacritic-insensitive matching goes through `lib/fold.js`: `fold()`
  (length-preserving, for highlighting) or `searchKey()` (also "dj" → "d",
  for filtering lists). Don't write another normalizer.
- Never `throw` on a GraphQL error in a page path — return `null` and let
  the route call `notFound()`. One malformed page must not 500 the site.
- Content is Croatian. UI strings, slugs and copy stay in Croatian.
- Always use `uri`, never `link` — `link` points at `backend.pfst.hr`.
- Yoast is installed but almost nothing is filled in, so the metadata
  fallback chain in `lib/seo.js` is the primary path, not a safety net.
  Canonicals are built in Next from `NEXT_PUBLIC_SITE_URL` — never passed
  through from WordPress.

## WordPress side

The site runs the Astra theme, but pfst4 is headless so the theme only
matters as a host for filters.

**Custom `wp_graphql_blocks_process_attributes` filters must live in
`wp-content/mu-plugins/`, never in the theme's `functions.php`.** Astra
auto-updates and will silently wipe them, taking file sizes, accordion
parsing and table parsing with it.

Three filters enrich block attributes that WPGraphQL Content Blocks does
not provide on its own:

- `core/file` — adds `filesizeBytes`, `filesizeHuman`, `mimeType`,
  `fileTitle`, `fileName`, `extension`, `fileLabel`.
  `fileLabel` is the anchor text the editor typed, falling back to
  `fileTitle`, then `fileName`.
- `core/details` — adds `summary` (HTML), `showContent` (the `open`
  attribute), `bodyHTML` (the details body with `<summary>` removed).
- `core/table` — adds `headers[]`, `rows[][]`, `caption`, `fixed`
  (`has-fixed-layout`). `headers` is an empty array when the table has no
  `thead`; the renderer must handle that.

Block HTML is sanitized before rendering. Keep `isomorphic-dompurify` in
the pipeline.

## Routing

One catch-all handles every page and post:

- `generateStaticParams` from all content URIs
- `export const dynamicParams = true` so new WordPress pages render on
  first request without a rebuild
- `generateMetadata` on every route, sourced from Yoast via
  WPGraphQL SEO. This is the single biggest launch risk — a public
  university site cannot lose its metadata.

Static routes take precedence over the catch-all, so `app/novosti/page.jsx`
and `app/[...slug]/page.jsx` coexist safely. Posts live at
`/novosti/<slug>/`; don't add other routes under `/novosti/` — filters are
query params (see News).

## Data layer

`wpFetch(query, variables, { tags })` — one function, POSTs to the GraphQL
endpoint with `cache: "force-cache"` and `next: { tags }` so content is
cached until revalidated on demand (Next 16 does not cache `fetch` by
default). A WordPress mu-plugin calls `/api/revalidate` on `save_post`,
which runs `revalidateTag("wp", { expire: 0 })`. Editors should not wait on
a timer.

Next only dedupes identical `GET` fetches within a render; `wpFetch` POSTs.
Anything requested more than once per render (the catch-all's node is read
by the layout, `generateMetadata` and the page) goes through React
`cache()` keyed by a primitive (the uri string, not the slug array).

Block content is styled globally inside `.prose` (`styles/typography.css`),
not per block. WordPress emits plain `h2`/`h3`; block components render the
correct tag and `.prose` styles it. Blocks that need structure the CSS
can't express (table scroll wrapper, file download panel) have their own
CSS Module.

## Block payload — confirmed from live data

`blocks` is a **JSON scalar**, not an object type. Select it bare:
`blocks(attributes: true, dynamicContent: true)`. Sub-selecting fields on it
makes WPGraphQL reject the whole query.

Each block has `name`, `attributes`, `dynamicContent` (rendered HTML) and
`innerBlocks`.

- **`core/details`** — render `attributes.summary`, then recurse
  `BlockRenderer` over `innerBlocks`. **Ignore `attributes.bodyHTML`**: the
  PHP filter reads `innerHTML` before inner blocks are populated, so it
  always comes back as an empty `<details></details>`. The real content is
  in `innerBlocks`.
- **`core/table`** — cells contain HTML (mailto links are everywhere in the
  staff tables). Sanitize and inject as HTML, never render as text. The PHP
  filter flattens `th` and `td` into `rows`, so row headers are lost;
  acceptable for now. Tables are wide (5 columns) — they scroll
  horizontally inside a focusable wrapper; the `<table>` keeps its native
  display so assistive tech still announces it as a table.
- **`core/paragraph`** — editors leave many empty paragraphs as spacing.
  Skip blocks whose `content` is empty or the layout gains random gaps.

- **`core/table` with the class `konzultacije`** (Advanced → Additional
  CSS class) renders as the searchable Konzultacije list instead of a table
  (`features/consultations/consultations.js` parses both the clean and the Excel-export column
  layouts).
- **`core/gallery`** — the image inner blocks become a mosaic that opens
  PhotoSwipe; images without width/height are skipped.

**Never give a post or page a purely numeric slug.** `nodeByUri` crashes
with "Internal server error" on `/novosti/4820/` ("Ocean Hackaton 2025",
slug = its ID), so the page 404s. Untitled-then-titled posts get their ID
as slug — rename the slug in WordPress.

Content debt to fix in WordPress eventually: some accordion summaries encode
hierarchy as text (`"- Katedra za..."` nested under a Zavod). The right fix
is nested `details`, not a leading dash.

## Inner pages

- One template for WordPress pages = `design/reference/page.html`; pages
  that are mainly a hub for their children = `design/reference/opcenito.html`
  (subpage cards).
- The sidebar is the WordPress page hierarchy of the current section, up
  to three levels (`SECTION_TREE`, from the top-level ancestor): current
  section and current page highlighted, groups expand/collapse, stacks
  above the content below 1080px, not sticky. A row with children is a
  link to that page plus a separate chevron button, so every page stays
  reachable. Child order is Page Attributes → Order, then title.
- "Na ovoj stranici" lists the page's top-level h2 blocks
  (`features/pages/headings.js` assigns the ids; shown from two headings up).
- Hub-card descriptions are the child page's Yoast meta description —
  WordPress pages have no excerpt.

## News

`istaknuto` is a **flag, not a topic.** 149 posts carry it, and they also
carry a real category (Najave, Natječaji, Službeno...). Consequences:

- Strip `istaknuto` before rendering a post's category label, or every
  featured post shows two chips (`lib/posts.js` `getPostCategories`).
- In the category tabs it is the last tab, "Istaknuto" (as in the design's
  news tabs) — that tab is the featured archive.
- Homepage news highlights: `categoryName: "istaknuto"`. The 149 posts
  also deserve their own archive, not just the homepage track.

Real categories and counts: Natječaji 165, Najave 144, Službeno 143,
Erasmus+ 71, Referada 48, Nastava 42, Projekti 30, Savjetovanja 16,
Stipendije 11, Bez kategorije 11.

Categories are **not colour-coded**: every category label is the design's
one neutral Chip (`--color-bg` background, or white on `--color-bg`).
"Bez kategorije" has 11 posts — reassign them in WordPress; until then the
UI shows a fallback label.

**One news archive, no taxonomy routes.** Categories, goals, search and
dates are all query filters on `/novosti` (`?kategorija=`, `?cilj=`, `?q=`,
`?od=`, `?do=`) — shareable and bookmarkable, and filtered views
canonicalize to `/novosti`. No `/novosti/kategorija/…`, `/novosti/ciljevi/…`
or tag folders. The old site's `/novosti/kategorije/:slug` and
`/novosti/ciljevi/:slug` are redirects in `next.config.mjs` to the matching
filter. Categories are the primary filter; goals are secondary.

Two content streams, rendered with the design's components:

- **Istaknuto** — always has a featured image → news cards (4:3 image, date
  + chip, Title M) / the homepage horizontal track.
- **Obavijesti** — several per day, mostly no image → news rows (date ·
  title · chip · arrow circle) inside a white r28 panel. No image
  placeholders.

WPGraphQL paginates with cursors, not page numbers. Use "load more" or
cursor pagination, not `?page=2`.

## ciljevi = UN Sustainable Development Goals

The 17 terms are the UN SDGs in Croatian. They are secondary to
categories: a filter on the news archive (`?cilj=`) and icons on a post
linking to that filter, nothing more — no goal pages.

- No colours and no colour palette — use the official icon images in
  `public/ciljevi/` (`hr/` for Croatian, `E-WEB-Goal-*` for English).
- The goal number is not stored in WordPress; `features/news/ciljevi.js` maps
  slug → number + icon.
- Five terms return `count: null` (zero posts) — hide empty terms from the
  filter.
- Fix in WordPress before launch: the term
  `odgovornja-potrosnja-i-proizvodnja` has a typo in both name and slug.

## English pages

The old site has an English version: ~50 static pages plus a homepage, and
almost no English news (roughly one post a year).

Translations run on **Polylang + WPGraphQL Polylang**. Croatian is the
default language with no URL prefix; English URIs are prefixed `/en/`, and
`nodeByUri` resolves them like any other. Consequences for queries:

- Content, menu and category queries take a `language` where-arg. Without
  it WPGraphQL Polylang returns the default language only —
  `ALL_CONTENT_URIS` needs `language: ALL` or English drops out of
  `generateStaticParams` and the sitemap.
- Each node exposes `language { code slug }` and `translations { uri … }`;
  the language switcher (HR / EN in the utility row) and `hreflang` read
  those, no manual linking.
- Categories are translated per language (`istaknuto` has to be looked up
  via `Category.translation` for English); `ciljevi` is not translatable and
  is shared across languages.
- Each language has its own menu at the same location.

What the frontend needs:

- **Language detection**: `getNodeLanguage(node)` (Polylang's field, falling
  back to the first URI segment: `en` → English, anything else → Croatian).
- **`<html lang>`** set per page. Without it screen readers pronounce
  English text with Croatian phonetics. Two root layouts, `(hr)` and `en`.
- **Language switcher** from `translations`. When empty, fall back to `/`
  and `/en/` respectively.
- **`hreflang`** pairs in `generateMetadata` where a counterpart exists.
- **UI strings** come from `chromeCopy.js` / `newsCopy.js` keyed by
  language — never hardcode Croatian in a component English pages render.
- **`/en`** is its own static route, like the Croatian homepage — not part
  of the catch-all.

## Raspored (Sceduly)

The timetable is not WordPress content: `app/(hr)/nastava/studiranje/raspored`
is a hardcoded route (it beats the catch-all at the same uri) fed by the
Sceduly REST API (`lib/sceduly.js`, server only; pure helpers and
`TIMETABLE_URI` in `lib/timetable.js`). Selection is query params
(`?studij=&godina=`, `?nastavnik=`, `?dvorana=`, `?tjedan=`).

- **Sceduly allows one sync per day and 10 concurrent connections.** The
  normalized data sits in `unstable_cache` with no time-based expiry; the
  daily Vercel cron (`/api/cron/sceduly`, `Authorization: Bearer
  $CRON_SECRET`) marks the `sceduly` tag stale and triggers the one
  refresh. Programme requests run at most 8 at a time. Don't add a
  `revalidate` timer or any other code path that calls Sceduly.
- Env: `SCEDULY_USER`, `SCEDULY_INSTITUTION_ID`, `SCEDULY_PASSWORD`,
  `SCEDULY_LOCATION`, `CRON_SECRET`. Without them `getTimetableData()`
  returns `null` and the page says the timetable is unavailable.
- Konzultacije rows link to the lecturer's Raspored view by matching
  names (`nameKey`: Sceduly is "First Last", the table "Last First").
- The homepage timetable tile is decorative: hardcoded entries in
  `features/home/timetableSample.js`, on purpose — it doesn't call Sceduly.
- No English timetable yet.

## Consent and personal storage

`lib/personal.js` is the only place that touches `localStorage` (prefix
`pfst:`, every access wrapped, read via `useSyncExternalStore` so hydration
never mismatches). Nothing in it leaves the browser.

- Always kept (explicit choices): the consent itself, the last Raspored
  selection ("Moj raspored" — opening Raspored without a selection goes
  back to it), starred lecturers in Konzultacije.
- Only with consent: recent searches and recently visited pages
  ("Povijest pregledavanja"). Withdrawing consent clears them.
- Vercel Analytics loads only with "Analitika" consent; `/preview` and
  `/styleguide` are never counted.
- `CookieConsent` shows until the visitor chooses ("Samo nužni" as easy as
  "Prihvati sve"); the footer's "Kolačići" button reopens the settings.
  TODO: link the privacy policy page once it exists.

## Content migration status

All inner pages still have to be created in WordPress by an editor; what is
in WP today is only a sample. `old-routes.txt` (in the project root) is the
list of URLs from the old Pages Router site and doubles as the editor's
task list.

`scripts/route-diff.mjs` compares old routes against live WordPress URIs and
suggests redirects. **It is only meaningful once the content is in.** Run it
before launch, not before. Where editors reproduce the old path structure
(matching slugs and parents), no redirect is needed at all — that is the
cheapest way to close most of the gap.

## Accessibility

PFST is a public institution, so the EU Web Accessibility Directive applies:
WCAG 2.1 AA is a requirement, not a nice-to-have. The design's contrast
rules (STYLEGUIDE §2) are hard rules; visible focus states;
`prefers-reduced-motion` disables all motion.

## Redesign phases

Data fetching, routing and the block → component mapping stay; the
presentation is rebuilt from `design/`. Stop after each phase for review.

0. Inventory (done)
1. Foundation — tokens, Plus Jakarta Sans, globals, typography + `.prose`,
   Lenis provider + `useGsap` helper
2. Primitives in `components/ui/` — Button, ArrowCircle, Chip, Eyebrow,
   PhotoTag, Image wrapper, Icon
3. Shell — SiteHeader (utility row, hero nav, mega menu, mobile menu,
   floating nav) and SiteFooter
4. Inner pages — page template, section overview, sidebar tree, page hero
   with breadcrumbs; then posts, news archive + filters (drop the goal
   pages, add the old-URL redirects)
5. Homepage — hero, most-visited bento, news highlights track, statement,
   study-programme stacking cards, other news, Upisi + Trening centar CTA

A phase is done when: no old-system leftovers in the files it touched
(`grep` for Archivo, `#0f385c`, `#058cc4`, `neutral-*`, `accent-100…900`,
`badge-*`, `shadow-*`, zero radii — the whole repo must be clean at the end
of phase 4), `npm run lint` and `next build` pass, and the added / changed /
deleted files are listed.
