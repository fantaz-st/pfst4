// UI strings for the site chrome shared between the Croatian and English
// trees (Header, MobileNav, Footer, SiteChrome's skip link, the 404 page).
// Same pattern as newsCopy.js: one dictionary, a language prop on each
// component, hr stays the default so existing output is unchanged.
const CHROME_COPY = {
  hr: {
    siteName: "Pomorski fakultet u Splitu",
    universityName: "Sveučilište u Splitu",
    skipToContent: "Preskoči na sadržaj",
    mainNavLabel: "Glavni izbornik",
    footerNavLabel: "Izbornik u podnožju",
    languageSwitcherLabel: "Odabir jezika",
    menuLabel: "Izbornik",
    backMenu: "Natrag",
    notFoundTitle: "Stranica nije pronađena",
    notFoundDescription: "Stranica koju tražite ne postoji ili je premještena.",
    notFoundHomeLink: "Povratak na naslovnicu",
  },
  en: {
    siteName: "Faculty of Maritime Studies, University of Split",
    universityName: "University of Split",
    skipToContent: "Skip to content",
    mainNavLabel: "Main menu",
    footerNavLabel: "Footer menu",
    languageSwitcherLabel: "Language selection",
    menuLabel: "Menu",
    backMenu: "Back",
    notFoundTitle: "Page not found",
    notFoundDescription:
      "The page you are looking for does not exist or has been moved.",
    notFoundHomeLink: "Back to homepage",
  },
};

export function getChromeCopy(language) {
  return CHROME_COPY[language] ?? CHROME_COPY.hr;
}
