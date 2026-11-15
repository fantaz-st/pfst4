import { BACKGROUND_COLOR, BRAND_COLOR, SHORT_NAME, SITE } from "@/lib/seo";

// One manifest for both languages (the site's default language is hr).
// Icons are rendered from the official sign (public/logo-sign-color-hr.svg)
// in the visual-standard colours, PFST modra + plava.
export default function manifest() {
  return {
    name: SITE.hr.name,
    short_name: SHORT_NAME,
    description: SITE.hr.description,
    lang: "hr",
    start_url: "/",
    scope: "/",
    display: "browser",
    theme_color: BRAND_COLOR,
    background_color: BACKGROUND_COLOR,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
