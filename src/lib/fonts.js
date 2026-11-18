import { Poppins } from "next/font/google";

// Poppins isn't a variable font, so every weight the design uses is listed
// (400–800) — one static file per weight and subset. next/font downloads
// them at build time and self-hosts them — no runtime request to Google —
// preloads them, and generates a size-adjusted fallback so the swap causes
// no layout shift.
// latin-ext is required: without it č ć ž š đ fall back to another face.
export const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-poppins",
});
