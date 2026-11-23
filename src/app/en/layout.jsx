import { plusJakartaSans } from "@/lib/fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import JsonLd from "@/components/seo/JsonLd";
import SiteAnalytics from "@/components/seo/SiteAnalytics";
import CookieConsent from "@/components/consent/CookieConsent";
import { buildRootMetadata, organizationJsonLd, rootViewport } from "@/lib/seo";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/typography.css";

export const metadata = buildRootMetadata("en");
export const viewport = rootViewport;

export default function EnRootLayout({ children }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body>
        <JsonLd data={organizationJsonLd("en")} />
        <SmoothScroll />
        {children}
        <CookieConsent language="en" />
        <SiteAnalytics />
      </body>
    </html>
  );
}
