"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsent } from "@/lib/personal";

// Editor-only pages: previews of drafts and the internal styleguide.
const IGNORED = ["/preview", "/styleguide"];

function beforeSend(event) {
  const { pathname } = new URL(event.url);
  return IGNORED.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ? null : event;
}

/**
 * Vercel Web Analytics: anonymised page views without cookies. Loads only
 * once the visitor allowed "Analitika" in the cookie settings
 * (components/consent); editor-only pages aren't counted.
 */
export default function SiteAnalytics() {
  const consent = useConsent();
  if (!consent?.analytics) return null;
  return <Analytics beforeSend={beforeSend} />;
}
