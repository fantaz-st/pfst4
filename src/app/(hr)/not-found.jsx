import SiteChrome from "@/components/layout/SiteChrome";
import NotFoundView from "@/features/pages/NotFoundView";

export const metadata = {
  title: "Stranica nije pronađena",
};

export default function NotFound() {
  return (
    <SiteChrome language="hr">
      <NotFoundView language="hr" />
    </SiteChrome>
  );
}
