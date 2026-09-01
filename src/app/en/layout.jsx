import { sourceSans, archivo } from "@/lib/fonts";
import "@/styles/globals.css";
import "@/styles/tokens.css";
import "@/styles/typography.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: "Faculty of Maritime Studies, University of Split",
  description: "Faculty of Maritime Studies, University of Split",
};

export default function EnRootLayout({ children }) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
