import SiteChrome from "@/components/layout/SiteChrome";
import NotFoundView from "@/components/content/NotFoundView";

export const metadata = {
  title: "Stranica nije pronađena — Pomorski fakultet u Splitu",
};

export default function NotFound() {
  return (
    <SiteChrome language="hr">
      <NotFoundView language="hr" />
    </SiteChrome>
  );
}
