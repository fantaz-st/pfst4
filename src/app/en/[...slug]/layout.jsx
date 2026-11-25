import SiteChrome from "@/components/layout/SiteChrome";
import { enContentRoute } from "@/features/pages/contentRoute";

export default async function SlugLayout({ children, params }) {
  const { slug } = await params;
  const translations = await enContentRoute.getTranslationsForSlug(slug);

  return (
    <SiteChrome
      language="en"
      translations={translations}
    >
      {children}
    </SiteChrome>
  );
}
