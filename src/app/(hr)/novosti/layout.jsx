import SiteChrome from "@/components/layout/SiteChrome";

// The news archive isn't a WordPress node (it's a hardcoded Next route), so
// there's no nodeByUri translations field to read — the counterpart uri is
// hardcoded here instead.
const TRANSLATIONS = [{ language: { code: "EN" }, uri: "/en/news/", title: "News" }];

export default function NovostiLayout({ children }) {
  return (
    <SiteChrome language="hr" translations={TRANSLATIONS}>
      {children}
    </SiteChrome>
  );
}
