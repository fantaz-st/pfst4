import { NOINDEX, toAbsoluteUrl } from "@/lib/seo";

export default function robots() {
  // Staging / preview deployments (SITE_NOINDEX=true) are closed entirely.
  if (NOINDEX) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Search result pages are NOT disallowed: they carry noindex,follow,
      // and a crawler has to be able to fetch them to see that.
      disallow: ["/api/", "/preview", "/styleguide"],
    },
    sitemap: toAbsoluteUrl("/sitemap.xml"),
    host: toAbsoluteUrl("/"),
  };
}
