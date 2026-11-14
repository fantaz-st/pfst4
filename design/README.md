# design/ — handoff for the new PFST site

| File | What it is |
|---|---|
| `STYLEGUIDE.md` | The rules — colours + contrast, type scale, spacing, components, navigation (§6a), motion. Wins over everything else. |
| `tokens.css` | CSS variables for all values. Import once; components use the variables. |
| `reference/home.html` | Homepage. Uses `styles.css` + `main.js`. |
| `reference/opcenito.html` | Inner **section overview** (sidebar + subpage cards). Uses `inner.css` + `inner.js`. |
| `reference/page.html` | Inner **content page** — the single WordPress page template (~99% of pages). |
| `reference/mega-menu.html` | Desktop **mega menu** (Fakultet open). Uses `menu.css` + `menu.js`. |
| `reference/mobile-menu.html` | **Mobile menu** — full-screen two-level accordion. Uses `menu.css` + `menu.js`. |
| `reference/post.html` | **Single post / article**. Uses `inner.css` + `post.css` + `inner.js` + `post.js`. |
| `reference/news.html` | **News listing** — 20 latest posts, sidebar filters, grid/list. Uses `inner.css` + `news.css` + `inner.js` + `news.js`. |
| `reference/*.svg` | Placeholder texture + signal-flag pattern. |
| `screens/` | Add full-page screenshots here (one per reference page). |

The reference pages are for **look and behaviour**, not code to paste: rebuild them as Next.js components with `tokens.css`, `next/font` (Montserrat) and `next/image`. Values in square brackets are placeholders.

## Add this to the project's CLAUDE.md

```md
## Design
- UI follows design/STYLEGUIDE.md; values come from design/tokens.css (no MUI, no raw hex in components).
- Visual + behaviour reference: design/reference/*.html (open in a browser) and design/screens/*.png.
  Match them, but don't copy their inline styles — build typed components with CSS modules/tokens.
- Header, floating nav, mega menu and footer are shared by every page (home.html, mega-menu.html, mobile-menu.html).
- Inner pages: one WordPress page template = page.html; section overviews = opcenito.html.
  The sidebar tree comes from the WP page hierarchy (WPGraphQL), current page highlighted.
- Posts: post.html (single), news.html (listing with filters).
- All content (menus, pages, posts, categories) comes from WordPress — never hardcode labels.
- Animations: GSAP (ScrollTrigger, SplitText) + Lenis exactly as specified in STYLEGUIDE.md §8,
  wrapped in gsap.matchMedia() so prefers-reduced-motion disables them.
```

## Suggested order of prompts
1. `tokens.css` → globals + Montserrat via `next/font`.
2. Primitives: Button, Chip, Eyebrow, ArrowCircle, Image wrapper, Icon.
3. Shell: SiteHeader (utility row, hero nav, floating nav), mega menu + mobile menu, SiteFooter.
4. Inner page template + sidebar (`page.html`, `opcenito.html`).
5. Posts: single post (`post.html`), then news listing (`news.html`).
6. Homepage sections one by one.
7. Motion layer (Lenis provider at the root, one GSAP setup per section).
