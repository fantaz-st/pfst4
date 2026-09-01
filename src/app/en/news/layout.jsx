import SiteChrome from "@/components/layout/SiteChrome";

// Mirrors the hardcoded translations on (hr)/novosti/layout.jsx — this route
// has no WordPress node either, so there's no nodeByUri translations field.
const TRANSLATIONS = [{ language: { code: "HR" }, uri: "/novosti/", title: "Novosti" }];

export default function EnglishNewsLayout({ children }) {
  return (
    <SiteChrome language="en" translations={TRANSLATIONS}>
      {children}
    </SiteChrome>
  );
}
