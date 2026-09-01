import SiteChrome from "@/components/layout/SiteChrome";
import NotFoundView from "@/components/content/NotFoundView";

export const metadata = {
  title: "Page not found — Faculty of Maritime Studies, University of Split",
};

export default function NotFound() {
  return (
    <SiteChrome language="en">
      <NotFoundView language="en" />
    </SiteChrome>
  );
}
