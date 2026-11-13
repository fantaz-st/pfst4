import { montserrat } from "@/lib/fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/typography.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: "Pomorski fakultet u Splitu",
  description: "Pomorski fakultet Sveučilišta u Splitu",
};

export default function HrRootLayout({ children }) {
  return (
    <html lang="hr" className={montserrat.variable}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
