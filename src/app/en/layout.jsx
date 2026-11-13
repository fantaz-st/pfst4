import { montserrat } from "@/lib/fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/typography.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: "Faculty of Maritime Studies, University of Split",
  description: "Faculty of Maritime Studies, University of Split",
};

export default function EnRootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
