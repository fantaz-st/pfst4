import { Plus_Jakarta_Sans } from "next/font/google";

// Plus Jakarta Sans is a variable font (weights 200–800), so leaving
// `weight` out ships one file per subset covering every weight the design
// uses (400–800). next/font downloads it at build time and self-hosts it —
// no runtime request to Google — preloads it, and generates a size-adjusted
// fallback so the swap causes no layout shift.
// latin-ext is required: without it č ć ž š đ fall back to another face.
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});
