import SiteChrome from "@/components/layout/SiteChrome";
import { hrContentRoute } from "@/lib/contentRoute";

export default async function SlugLayout({ children, params }) {
  const { slug } = await params;
  const translations = await hrContentRoute.getTranslationsForSlug(slug);

  return (
    <SiteChrome language="hr" translations={translations}>
      {children}
    </SiteChrome>
  );
}
