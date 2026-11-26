import { getMainMenu } from "@/lib/wp/menu";
import { getChromeCopy } from "@/lib/i18n/chromeCopy";
import { getSiteLinks } from "@/lib/i18n/siteLinks";
import { getLanguageLinks } from "@/lib/i18n/languageLinks";
import UtilityRow from "./UtilityRow";
import SiteHeader from "@/components/layout/header/SiteHeader";
import SiteFooter from "./SiteFooter";
import PageMotion from "@/components/motion/PageMotion";
import BackToTop from "./BackToTop";
import styles from "./SiteChrome.module.css";

// The shell around every route: skip link, utility row, header (nav over
// the page's Hero, floating nav, menu sheet), <main>, footer. Rendered
// per-route so routes that know their WordPress node — the [...slug]
// catch-alls — can pass real Polylang translations for the HR / EN switch;
// everything else gets the other language's homepage.
export default async function SiteChrome({ language, translations = null, children }) {
  const menu = await getMainMenu(language);
  const copy = getChromeCopy(language);
  const links = getSiteLinks(language);
  const languages = getLanguageLinks(language, translations);

  return (
    <div className={styles.shell}>
      <a href="#main-content" className="skip-link">
        {copy.skipToContent}
      </a>
      <UtilityRow language={language} translations={translations} />
      <SiteHeader
        menu={menu}
        language={language}
        frequent={links.frequent}
        languages={languages}
        utility={links.utility}
      />
      <main id="main-content" className={styles.main} tabIndex={-1}>
        {children}
      </main>
      <SiteFooter language={language} />
      <BackToTop label={copy.backToTop} ariaLabel={copy.backToTopLabel} />
      <PageMotion />
    </div>
  );
}
