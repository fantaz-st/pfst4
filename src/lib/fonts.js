import { Source_Sans_3, Archivo } from "next/font/google";

// Shared across both locale root layouts (app/(hr)/layout.jsx and
// app/en/layout.jsx) so the font faces stay identical between languages.
export const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

// The design's display typeface (CLAUDE.md § Design intent) — used for
// headings sitewide (typography.css) and the homepage's bold display type.
// Body copy stays on Source Sans. Replaces the earlier scaffolded serif.
export const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});
