import { Montserrat } from "next/font/google";

// Montserrat is a variable font, so leaving `weight` out ships one file per
// subset covering every weight the design uses (400–800) instead of five
// static files. next/font downloads it at build time and self-hosts it —
// no runtime request to Google — preloads it, and generates a size-adjusted
// fallback so the swap causes no layout shift.
// latin-ext is required: without it č ć ž š đ fall back to another face.
export const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-montserrat",
});
