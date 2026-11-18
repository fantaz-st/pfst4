import { plusJakartaSans } from "@/lib/fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import JsonLd from "@/components/seo/JsonLd";
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
      </body>
    </html>
  );
}
