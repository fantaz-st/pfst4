import SiteChrome from "@/components/layout/SiteChrome";
import { enContentRoute } from "@/lib/contentRoute";

export default async function SlugLayout({ children, params }) {
  const { slug } = await params;
  const translations = await enContentRoute.getTranslationsForSlug(slug);
  const currentUri = `/en/${slug.join("/")}/`;

  return (
    <SiteChrome
      language="en"
      translations={translations}
      currentUri={currentUri}
    >
      {children}
    </SiteChrome>
  );
}
