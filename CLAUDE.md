# pfst4

Rewrite of the Faculty of Maritime Studies Split website (pfst.unist.hr).
Replaces a Next.js 12 + MUI site where posts came from WordPress but inner
pages were hardcoded React. In pfst4 **all** content lives in WordPress.

The previous attempt (pfst3) stalled because MUI reached 39 of 76 files and
forced almost everything to be a client component. Do not repeat that.

## Stack

- Next.js 16, App Router
- JavaScript, not TypeScript (`jsconfig.json`, `@/*` -> `src/*`)
- Plain CSS Modules (`.module.css`) — **no Sass**, no PostCSS plugins,
  no Tailwind. Design tokens are CSS custom properties in `tokens.css`.
  Media queries cannot read CSS variables, so breakpoints are written
  literally. Use only these four: 40rem, 48rem, 64rem, 80rem.
  Prefer `clamp()` for type, `repeat(auto-fit, minmax())` for grids and
  `@container` for component-level responsiveness, so most components need
  no media query at all.
- Headless WordPress via WPGraphQL + WPGraphQL Content Blocks
- `next/font/google` — **always** include `latin-ext` or Croatian
  diacritics (č ć ž š đ) fall back to a different face

## Hard rules

- **No MUI. No Emotion. No component library.** Layout and typography are
  hand-written CSS Modules.
- **No Apollo, no urql.** Data fetching is plain `fetch` to the GraphQL
  endpoint from Server Components.
- **`"use client"` is the exception.** Expected client components: mobile
  nav drawer, lightbox scope, news filters, and the homepage animation
  components. Nothing else without a reason. Block renderers are Server
  Components.
- **GSAP is allowed, but only for animation.** It may be imported only
  inside `"use client"` components that exist to animate something —
  scroll-driven homepage sections, the auto-hiding header. It must never
  appear in `BlockRenderer`, in any block element, or anywhere in the
  content tree. If adding GSAP to a file would make that file the first
  client component in its subtree, that is the wrong file.
  No other animation or UI library.
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
and `app/[...slug]/page.jsx` coexist safely.

## Data layer

`wpFetch(query, variables, { tags })` — one function, POSTs to the GraphQL
endpoint, passes `next: { tags }` so content can be revalidated on demand.
A WordPress mu-plugin calls `/api/revalidate` on `save_post`, which runs
`revalidateTag('wp')`. Editors should not wait on a timer.

Typography and block styles are global inside `.prose`, not per-component.
WordPress emits plain `h2`/`h3`; block components render the correct tag and
`typography.css` styles it.

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
  acceptable for now. Tables are wide (5 columns) — they need horizontal
  scroll on narrow screens.
- **`core/paragraph`** — editors leave many empty paragraphs as spacing.
  Skip blocks whose `content` is empty or the layout gains random gaps.

Content debt to fix in WordPress eventually: some accordion summaries encode
hierarchy as text (`"- Katedra za..."` nested under a Zavod). The right fix
is nested `details`, not a leading dash.

## News

`istaknuto` is a **flag, not a topic.** 149 posts carry it, and they also
carry a real category (Najave, Natječaji, Službeno...). Consequences:

- Strip `istaknuto` before rendering a post's category label, or every
  featured post shows two tags.
- Do not list it alongside the others in the filter sidebar.
- Homepage featured strip: `categoryName: "istaknuto"`, first 3. But 149
  posts also deserve their own archive, not just three cards.

Real categories and counts: Natječaji 165, Najave 144, Službeno 143,
Erasmus+ 71, Referada 48, Nastava 42, Projekti 30, Savjetovanja 16,
Stipendije 11, Bez kategorije 11.

Ten categories is too many to color-code — ten distinct hues that all pass
4.5:1 look like confetti and nobody learns them. Give a color to the four
busiest (Natječaji, Najave, Službeno, Erasmus+) and render the rest as
neutral grey labels, so color carries meaning.

"Bez kategorije" has 11 posts. Reassign them in WordPress or the UI needs a
fallback label.

Two content streams, rendered differently:

- **Istaknuto** — always has a featured image, shown as image cards.
- **Obavijesti** — several per day, mostly no image. A dense list grouped
  by day with publish time and a category label. No image placeholders, no
  colored logo tiles.

WPGraphQL paginates with cursors, not page numbers. Plan for "load more" or
cursor pagination, not `?page=2`.

## English pages

The old site has an English version: ~50 static pages plus a homepage. No
English news stream (roughly one post a year), so **no translation plugin** —
no Polylang, no WPML. English pages are ordinary WordPress pages nested under
an `en` parent, and `nodeByUri` resolves `/en/faculty/...` exactly like the
Croatian ones. No query changes needed.

Editors mirror the Croatian hierarchy under `en`, so
`/en/faculty/general/management` corresponds to
`/fakultet/opcenito/ustroj/uprava`.

What the frontend needs:

- **Language detection** from the first URI segment: `en` → English,
  anything else → Croatian.
- **`<html lang>`** set per page. Without it screen readers pronounce
  English text with Croatian phonetics.
- **Language switcher** using a manual link between counterparts — an ACF
  Post Object field ("Prijevod") filled on the Croatian side, read in
  reverse from the English side. When empty, fall back to `/` and `/en`
  respectively.
- **`hreflang`** pairs in `generateMetadata` where a counterpart exists.
- **`/en`** is its own static route, like the Croatian homepage — not part
  of the catch-all.

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

## Design intent

The homepage design is authored by the developer in Claude Design
(`PFST Naslovnica v4.dc.html`). When the design and an existing token or
default disagree, **the design wins and the token changes** — the rules in
this file protect the architecture (static rendering, Server Components,
no component library, plain CSS Modules), not the current visual choices.

Specifically: sharp corners, the display typeface and the header behaviour
are deliberate design decisions, not deviations to be worked around. Adjust
`tokens.css` and the shared `Header` to match rather than preserving what
happened to be scaffolded earlier.

Placeholder content on a public university site must look obviously fake —
`000`, `TODO`, `Ime Prezime` — never plausible invented figures, names or
quotes, and always marked with a `TODO` comment in the code.

## Accessibility

PFST is a public institution, so the EU Web Accessibility Directive applies:
WCAG 2.1 AA is a requirement, not a nice-to-have. Body text at 4.5:1
minimum, visible focus states, `prefers-reduced-motion` respected.

## ciljevi = UN Sustainable Development Goals

The 17 terms are the UN SDGs in Croatian ("Kvalitetno obrazovanje" = SDG 4,
"Dostojanstven rad i gospodarski rast" = SDG 8, and so on). They have
official numbers, colors and icons, so the filter UI should be a numbered
17-tile grid in the official palette, not a generic tag list. The goal
number is not stored in WordPress — it needs either an ACF field on the term
or a slug → number map in the code.

Counts are very uneven: Kvalitetno obrazovanje 69, Partnerstvom do ciljeva
43, and five terms return `count: null` (meaning zero). Hide empty terms
from filter menus but keep their archives routable.

Fix in WordPress before launch: the term
`odgovornja-potrosnja-i-proizvodnja` has a typo in both name and slug.
Later it becomes a redirect.

## Phase order

Functionality first, design second — design changes, data shape does not.

0. Move block filters to a mu-plugin; install Yoast + WPGraphQL for
   Yoast SEO; fix the `odgovornja` typo and the uncategorized posts
1. Scaffold, `tokens.css`, `typography.css`, fonts, styleguide route
2. `lib/wp.js` + `queries.js` (with the fixes listed above)
3. `[...slug]` rendering one three-level page end to end
4. Menus, breadcrumbs, section rail, footer
5. News: archive, single post, category and goals filters
6. Homepage
7. Revalidation webhook, sitemap, robots, draft preview
8. Editors enter the remaining pages in WordPress (Croatian + `en`),
   then run route-diff and add redirects for whatever still moved

Style minimally during phases 2-5. Readable text only.
