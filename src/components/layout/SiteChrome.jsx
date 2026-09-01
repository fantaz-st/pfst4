import { getMainMenu } from "@/lib/menu";
import { getChromeCopy } from "@/lib/chromeCopy";
import HeaderScroll from "@/components/home/HeaderScroll";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./SiteChrome.module.css";

// Wraps a route's content with the shared Header/Footer chrome. Rendered
// per-route (not from a shared root layout) so that routes with access to
// their own params — the [...slug] catch-alls — can pass real per-page
// translations, while everything else falls back to translations=null
// (the Header then links the switcher to / or /en/ instead of hiding it).
export default async function SiteChrome({ language, translations = null, children }) {
  const menu = await getMainMenu(language);
  const copy = getChromeCopy(language);

  return (
    <>
      <a href="#main-content" className="skip-link">
        {copy.skipToContent}
      </a>
      <HeaderScroll>
        <Header menu={menu} currentLanguage={language} translations={translations} />
      </HeaderScroll>
      <main id="main-content" className={styles.main}>
        {children}
      </main>
      <Footer menu={menu} language={language} />
    </>
  );
}
