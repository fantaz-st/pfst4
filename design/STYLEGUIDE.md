# PFST — Styleguide

Rules for the new pfst.unist.hr (Next.js + headless WordPress). Values live in `tokens.css`; the working reference is `reference/*.html`. If this file and the reference disagree, this file wins.

## 1. Principles
- Light, institutional, modern. Big confident type, generous space, rounded blocks, real photography.
- Bound to the Faculty visual standard: PFST modra + PFST plava, Montserrat. Sans-serif only.
- No MUI. No gradients, no drop shadows, no emoji, no left-border "accent" cards.
- Every interactive element is a real `<a>` / `<button>` / `<input>`; visible focus; min. touch target 44px.

## 2. Colour
| Token | Hex | Use |
|---|---|---|
| `--pfst-modra` | `#00246F` | All text, dark sections (studies, footer), primary buttons, dark tile |
| `--pfst-plava` | `#30ABF0` | Accent: key CTA (Upisi), active dots, progress, signal-flag pattern |
| `--pfst-crna` | `#000000` | Print/monochrome only — not for web text |
| `--color-bg` | `#F1F4F8` | Page background, icon boxes, grey chips |
| `--color-surface` | `#FFFFFF` | Cards, tiles, panels over photos |
| `--color-text-muted` | `#4F5B73` | Secondary text, dates, descriptions |
| `--color-text-on-dark` | `#B4C2DD` | Secondary text on modra |
| `--color-line` | `#E6EBF2` | Dividers between list rows |
| tints | `#D3ECFB #C6E5F9 #EAF4FC #DCE6F4 #E3EBF6` | Alternate card backgrounds |
| `--color-error` / `--color-success` | `#C42B1C` / `#0E7C4A` | Forms and status only |

**Contrast rules (hard):**
- Text on plava is **always modra** (5.5:1). White on plava is not allowed (2.6:1).
- Focus rings are **modra 2px** — plava fails 3:1 on white.
- At most **one accent (plava) element per screen section**.
- Proportion: ~60% white/bg, ~30% modra, ~10% plava.

## 3. Typography — Montserrat
Load with `next/font/google`, subsets `latin` + `latin-ext` (č ć š ž đ). Weights 400/500/600/700/800.

| Style | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| Hero (home H1) | `clamp(48px, 7.4vw, 120px)` | .90 | -.04em | 600 |
| Page title (inner H1) | `clamp(44px, 6.4vw, 96px)` | .92 | -.04em | 600 |
| H2 section | `clamp(40px, 5vw, 76px)` | .95 | -.035em | 600 |
| Statement | `clamp(32px, 4vw, 62px)` | 1.04 | -.035em | 600 |
| H3 large card | `clamp(32px, 3.5vw, 52px)` | .98 | -.035em | 600 |
| Title L | 34px | 1 | -.035em | 600 |
| Title M (news card) | 23px | 1.25 | -.025em | 500 |
| Title S (tiles, rows) | 19–21px | 1.3 | -.02em | 500–600 |
| Body L (intros) | 17px | 1.55 | 0 | 400 — max ~60ch |
| Body | 15px | 1.5 | 0 | 400 |
| Small | 14.5px | 1.45 | 0 | 400, muted |
| Label | 12px | — | .08em | 500, UPPERCASE |
| Micro | 11px | — | .14em | 500, UPPERCASE |
| Wordmark (footer "PFST") | 25vw | .74 | -.045em | 800 |

- Headings in sentence case, never all-caps. Labels always uppercase.
- Dates and numbers: `font-variant-numeric: tabular-nums`.
- Logo wordmark: "POMORSKI / FAKULTET / U SPLITU", 700, .14em, three lines, next to the mark.

## 4. Layout & spacing
- Container 1400px, gutter 40px (20px < 720px). 4px spacing base.
- Full-width rounded blocks (hero, dark sections, CTA pair, footer) are inset **12px** from the viewport.
- Section vertical padding 128–144px; section header → content 48px.
- Card grids gap **12px**. Bento: 4 columns, rows 216px.
- Inner pages: sidebar (300–320px) + content, `flex-wrap` so the sidebar stacks on top below 1080px. The sidebar is not sticky.
- Breakpoints: **1080** (nav → menu button, 2-col grids, sidebar stacks), **900** (news track → native scroll), **720** (1 column).

## 5. Radii
10 mini UI · 14 icon box · 16 input / small panel · 20–22 panel over photo · 24 card/tile · 28 hero/feature · 32 section block · 999 pills, buttons, chips.
Nested rule: inner radius = outer radius − padding (32 card, 14 padding → ~18–22 image).

## 6. Components
- **Button** — pill, 52px (L) / 48 (M) / 44 (S). Label 15/500, left padding 24, 38px arrow circle on the right; on hover the arrow rotates −45° (.5s, ease-out). Variants: primary (modra), white (on photo/dark), accent (plava + modra text), outline (1px `#C3CCD8` inset), glass (white 14% + blur, only over photo/dark). Buttons without a circle = secondary action.
- **Arrow circle (`go`)** — 44/52px round, bg `--color-bg`, modra arrow; hover: rotates −45° and fills modra.
- **Eyebrow** — 32px pill, 7px plava dot + Label text. Light (white bg) and dark (white 10%) versions.
- **Chip** — 28px pill, 12.5/500, bg `--color-bg` (or white on bg).
- **Photo tag** — 11px uppercase on `--photo-tag`, bottom-left of image placeholders. Remove when a real photo is in.
- **Tile** (quick links) — white, r24, padding 26, 48px icon box (r14, bg) top-left, arrow circle top-right, title + description bottom. Hover: lift 6px. Variants: dark (modra), accent (plava, modra text), image (photo + white panel).
- **News card** — 4:3 image r24, date + chip row, Title M. Featured: 680×540 photo with a white panel inset 14px.
- **News row** — date (120px) · title · chip · arrow circle; rows divided by `--color-line`; inside a white r28 panel.
- **Study card** — r32, padding 14, text half + image half; sticky stacking on scroll.
- **Header (all pages)** — utility row (40px) above; main nav sits inside the hero (logo, glass pill nav, white "Upiši se", menu button). Floating dark pill nav slides in after the hero. Inner pages highlight the current top-level item as a white pill. Top-level items open the mega menu (§6a).
- **Footer (all pages)** — modra block r32 inset 12: logo + CTA, 4 columns (Adresa, Kontakt, Fakultet, Studenti), giant "PFST" wordmark, bottom bar.
- **Inner page sidebar** — white r24 panel; level 1 rows 44px r14 (open = bg tint, current section = modra fill); level 2 rows 40px (current page = `#EAF4FC` + plava dot); level 3 rows 36px. Chevron rotates 180° when open. Tree comes from the WordPress page hierarchy.
- **Forms** (subpages) — inputs 52px, r16, white, 1px `#D3DBE6` border → hover `#93A6CC` → focus 2px modra; error 2px `#C42B1C` + message below; checkbox 24px r8, checked = modra.
- **Signal flags** — graphic element from the visual standard (modra/plava/white square modules). Use as a band along the edge of a surface (Upisi card), never behind text.

## 6a. Navigation (reference: `reference/mega-menu.html`, `reference/mobile-menu.html`)
Content comes from WordPress (WPGraphQL menu, location `primary`): top-level items → groups → links. Never hardcode labels.

**Desktop mega menu (≥1080px)**
- Trigger: the top-level item in the glass nav is a `<button>` (not a link) with `aria-expanded` + `aria-controls`. Open = white pill, modra text, chevron rotated 180°. One panel open at a time.
- Panel: white, r24, positioned 88px from the top of the hero, inset 12px left/right, overflow hidden. Padding 36. Thin signal-flag strip (10px) along the bottom edge.
- Layout: intro column 300px (label with plava dot, Title L "Sve o …", one-line description, featured photo card 220px r20 with white panel + arrow circle, "Pregled cjeline" link) + 4 columns of groups, gap 44, columns separated by 1px `--color-line`, 28px inner padding, two groups stacked per column (36px apart).
- Group heading: 16/600, links to the group page, 28px arrow circle on the right (hover: rotate −45°, fills modra). Links: 14.5px, min-height 34px, muted-2 → modra on hover with a 12px plava line sliding in before the text. A group without children shows a one-line description instead.
- Footer bar: `#F7F9FB`, top border `--color-line`; search pill (52px, bg `--color-bg`, focus ring 2px modra) on the left; "Često traženo" chips (white) + "Zatvori" button on the right.
- Backdrop: modra-deep at 50% + blur 6px over the hero.
- Closes on: second click on the trigger, backdrop click, "Zatvori", Esc, route change. Focus moves into the panel on open and back to the trigger on close.
- Motion: panel clip-path `inset(0 0 100% 0 round 24px)` → 0, 0.8s expo.out; then `[data-mm-item]` y 18 → 0 + fade, 0.7s, stagger 0.035s, delay 0.12s. None under reduced motion.

**Mobile menu (<1080px)**
- Full-screen sheet (`role="dialog"`, `aria-modal="true"`), white. Top: logo + 48px modra close button; search pill 48px.
- Two-level accordion: level 1 rows 60px, 20/600, bottom border `--color-line`, 36px chevron circle (open = modra fill, rotated). Level 2 rows 50px r14, 15/600 (open = bg `--color-bg`). Level 3 links 44px, 14.5px, indented 28px; first link is "Pregled: {group}". One open item per level.
- Pinned bottom: full-width accent "Upiši se" (54px), then Webmail · Raspored · Pristupačnost and HR / EN. Signal-flag strip 8px at the very bottom.
- Tab is trapped inside the sheet; body scroll locked while open (Lenis `stop()` / `start()`); close returns focus to the menu button.

## 7. Imagery
- Real people, ships, simulators, campus; natural light; no stock backdrops.
- Text never sits directly on a photo except in the hero (with `--scrim-hero`). Elsewhere use a white panel over the photo.
- Ratios: hero full-bleed 880h (inner 500–520h); featured 5:4; card 4:3; thumbnail 1:1.
- `next/image`, AVIF/WebP, `sizes` set; while loading show `--color-deep` or a tint. Alt text describes the content.

## 8. Motion — GSAP 3.15 (ScrollTrigger, SplitText) + Lenis 1.3
Everything is disabled under `prefers-reduced-motion: reduce` (use `gsap.matchMedia()`).
- Easing: `expo.out` (= `cubic-bezier(.16,1,.3,1)`); wipes `expo.inOut`; small fades `power3.out`.
- Entrances run once (`once: true`, trigger `top 88–92%`). Scroll effects use `scrub`.
- **Split text**: split → animate → `revert()` on complete. Lines: `mask: 'lines'`, yPercent 105→0, 1.2s, stagger .1. Chars (hero, wordmark): yPercent 110, rotate 8°, 1.3s, stagger .022. Wait for `document.fonts.ready` before splitting.
- **Fade-up**: y 32–36, opacity 0, 1.1s power3.out. **Stagger groups**: y 60–70, scale .96, stagger .06–.07.
- **Image curtain**: clip `inset(100% 0 0 0)` → 0, 1.4s expo.inOut + inner scale 1.35 → 1, 1.8s.
- **Hero**: media scale 1.3 → 1 (2.2s) on load; on scroll the box scales to .93, radius 28 → 44, media parallax yPercent 14, content fades up.
- **Floating nav**: enters when the hero bottom passes 90px (0.8s expo.out), leaves 0.5s power3.in.
- **Horizontal news track** (≥900px): sticky 100vh frame, track x = −(scrollWidth − width), progress bar scaleX.
- **Stacking cards**: sticky top 104 + 20·i; previous card scales to .9 + .02·i, dims to 45%.
- **Statement**: words opacity .14 → 1 scrubbed; image pills grow from width 0.
- **Magnetic button**: hover devices only, 30% x / 40% y, quickTo .6s.

## 9. Content conventions
- Croatian first (`lang="hr"`), EN switch in the utility row.
- Dates `12. 11. 2026.`; academic years `2026./2027.`
- Placeholders in the reference are `[IN BRACKETS]` — never ship them.
