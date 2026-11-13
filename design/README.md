# design/ — handoff for the new PFST site

| File | What it is |
|---|---|
| `STYLEGUIDE.md` | The rules — colours + contrast, type scale, spacing, components, motion. Wins over everything else. |
| `tokens.css` | CSS variables for all values. Import once; components use the variables. |
| `reference/home.html` | Homepage — open in a browser. Uses `styles.css` + `main.js`. |
| `reference/opcenito.html` | Inner **section overview** (sidebar + subpage cards). Uses `inner.css` + `inner.js`. |
| `reference/page.html` | Inner **content page** — the single WordPress page template (~99% of pages). |
| `reference/*.svg` | Placeholder texture + signal-flag pattern. |
| `screens/` | Add full-page screenshots here (`home.png`, `opcenito.png`, `page.png`). |

The reference pages are for **look and behaviour**, not code to paste: rebuild them as Next.js components with `tokens.css`, `next/font` (Montserrat) and `next/image`. Values in square brackets are placeholders.

## Add this to the project's CLAUDE.md

```md
## Design
- UI follows design/STYLEGUIDE.md; values come from design/tokens.css (no MUI, no raw hex in components).
- Visual + behaviour reference: design/reference/*.html (open in a browser) and design/screens/*.png.
  Match them, but don't copy their inline styles — build typed components with CSS modules/tokens.
- Header, floating nav and footer are shared by every page (see reference/home.html).
- Inner pages: one WordPress page template = design/reference/page.html; section overviews = opcenito.html.
  The sidebar tree comes from the WP page hierarchy (WPGraphQL), current page highlighted.
- Animations: GSAP (ScrollTrigger, SplitText) + Lenis exactly as specified in STYLEGUIDE.md §8,
  wrapped in gsap.matchMedia() so prefers-reduced-motion disables them.
```

## Suggested order of prompts
1. `tokens.css` → globals + Montserrat via `next/font`.
2. Shared `SiteHeader` (utility row, hero nav, floating nav) and `SiteFooter`.
3. Primitives: Button, Chip, Eyebrow, ArrowCircle, PhotoPlaceholder/`next/image` wrapper.
4. Inner page template + sidebar from WP hierarchy (`page.html`, `opcenito.html`).
5. Homepage sections one by one (hero, bento, news track, statement, studies stack, news list, CTA).
6. Motion layer (one `useGsap` setup per section, Lenis provider at the root).
