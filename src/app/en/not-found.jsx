import SiteChrome from "@/components/layout/SiteChrome";
import NotFoundView from "@/components/content/NotFoundView";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <SiteChrome language="en">
      <NotFoundView language="en" />
    </SiteChrome>
  );
}
