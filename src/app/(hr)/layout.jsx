import { montserrat } from "@/lib/fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import JsonLd from "@/components/seo/JsonLd";
import { buildRootMetadata, organizationJsonLd, rootViewport } from "@/lib/seo";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/typography.css";

export const metadata = buildRootMetadata("hr");
export const viewport = rootViewport;

export default function HrRootLayout({ children }) {
  return (
    <html lang="hr" className={montserrat.variable}>
      <body>
        <JsonLd data={organizationJsonLd("hr")} />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
