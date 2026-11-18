// UI strings for the site shell and inner pages, keyed by language.
// Components take a `language` prop; hr stays the default.

// Croatian plurals: 1, 21… → one; 2–4, 22–24… → few; otherwise many.
function hrPlural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

const CHROME_COPY = {
  hr: {
    siteName: "Pomorski fakultet u Splitu",
    siteNameHome: "Pomorski fakultet u Splitu — početna",
    brandLines: ["Pomorski", "fakultet", "u Splitu"],
    universityName: "Sveučilište u Splitu",
    utilityTagline: "Sveučilište u Splitu — Pomorski fakultet",
    skipToContent: "Preskoči na sadržaj",
    mainNavLabel: "Glavna navigacija",
    utilityNavLabel: "Pomoćna navigacija",
    languageLabel: "Jezik",
    search: "Pretraga",
    searchPlaceholder: "Pretraži stranice Fakulteta",
    searchShort: "Pretraži",
    enroll: "Upiši se",
    menu: "Izbornik",
    closeMenu: "Zatvori izbornik",
    close: "Zatvori",
    brandShort: "PFST",
    brandTagline: ["Pomorski fakultet", "u Splitu"],
    closeSearch: "Zatvori pretragu",
    searchClear: "Obriši upit",
    searching: "Tražim…",
    searchAll: (query) => `Svi rezultati za „${query}”`,
    searchOpenFull: "Otvori stranicu pretrage",
    megaMenuLabel: (label) => `${label} — izbornik`,
    sectionOverview: (label) => `Pregled cjeline ${label}`,
    groupOverview: (label) => `Pregled: ${label}`,
    frequent: "Često traženo",
    footerAddress: "Adresa",
    footerContact: "Kontakt",
    footerFaculty: "Fakultet",
    footerStudents: "Studenti",
    copyright: (year) => `© ${year} Pomorski fakultet u Splitu`,

    // Inner pages
    breadcrumbsLabel: "Mrvice",
    breadcrumbsHome: "Početna",
    sectionNavLabel: "Navigacija sekcije",
    sectionCount: (n) => `${n} ${hrPlural(n, "cjelina", "cjeline", "cjelina")}`,
    toggleSubpages: (label) => `Podstranice: ${label}`,
    onThisPage: "Na ovoj stranici",
    lastModified: "Zadnja izmjena:",
    printPage: "Ispiši stranicu",
    sharePage: "Podijeli stranicu",
    linkCopied: "Poveznica je kopirana",
    inThisSection: "U ovoj cjelini",
    pageCount: (n) => `${n} ${hrPlural(n, "stranica", "stranice", "stranica")}`,
    helpEyebrow: "Niste pronašli što tražite?",
    helpTitle: "Javite se tajništvu Fakulteta.",
    helpCta: "Svi kontakti",
    neighboursLabel: "Susjedne stranice",
    previous: "Natrag",
    next: "Sljedeće",
    tableLabel: "Tablica",

    // Not found
    notFoundEyebrow: "Greška 404",
    notFoundTitle: "Stranica nije pronađena",
    notFoundDescription: "Stranica koju tražite ne postoji ili je premještena.",
    notFoundHomeLink: "Povratak na naslovnicu",

    // Search
    searchTitle: "Pretraga",
    searchEyebrow: "Pretraživanje",
    searchLabel: "Pojam za pretraživanje",
    searchSubmit: "Traži",
    searchResultsFor: (query) => `Rezultati za „${query}”`,
    searchPages: "Stranice",
    searchPosts: "Novosti",
    searchEmpty: "Nema pronađenih rezultata.",
    searchPrompt: "Upišite pojam koji tražite.",
    loadMorePages: "Prikaži još stranica",

    // Preview
    previewNotice: "Pregled neobjavljenog sadržaja.",
    previewExit: "Izađi iz pregleda",
  },
  en: {
    siteName: "Faculty of Maritime Studies, University of Split",
    siteNameHome: "Faculty of Maritime Studies — home",
    brandLines: ["Faculty of", "Maritime", "Studies"],
    universityName: "University of Split",
    utilityTagline: "University of Split — Faculty of Maritime Studies",
    skipToContent: "Skip to content",
    mainNavLabel: "Main navigation",
    utilityNavLabel: "Utility navigation",
    languageLabel: "Language",
    search: "Search",
    searchPlaceholder: "Search the Faculty website",
    searchShort: "Search",
    enroll: "Apply",
    menu: "Menu",
    closeMenu: "Close menu",
    close: "Close",
    brandShort: "PFST",
    brandTagline: ["Faculty of", "Maritime Studies"],
    closeSearch: "Close search",
    searchClear: "Clear search",
    searching: "Searching…",
    searchAll: (query) => `All results for “${query}”`,
    searchOpenFull: "Open the search page",
    megaMenuLabel: (label) => `${label} — menu`,
    sectionOverview: (label) => `${label} overview`,
    groupOverview: (label) => `Overview: ${label}`,
    frequent: "Frequently visited",
    footerAddress: "Address",
    footerContact: "Contact",
    footerFaculty: "Faculty",
    footerStudents: "Students",
    copyright: (year) => `© ${year} Faculty of Maritime Studies, University of Split`,

    breadcrumbsLabel: "Breadcrumbs",
    breadcrumbsHome: "Home",
    sectionNavLabel: "Section navigation",
    sectionCount: (n) => `${n} ${n === 1 ? "section" : "sections"}`,
    toggleSubpages: (label) => `Subpages: ${label}`,
    onThisPage: "On this page",
    lastModified: "Last updated:",
    printPage: "Print page",
    sharePage: "Share page",
    linkCopied: "Link copied",
    inThisSection: "In this section",
    pageCount: (n) => `${n} ${n === 1 ? "page" : "pages"}`,
    helpEyebrow: "Didn't find what you were looking for?",
    helpTitle: "Contact the Faculty office.",
    helpCta: "All contacts",
    neighboursLabel: "Neighbouring pages",
    previous: "Back",
    next: "Next",
    tableLabel: "Table",

    notFoundEyebrow: "Error 404",
    notFoundTitle: "Page not found",
    notFoundDescription:
      "The page you are looking for does not exist or has been moved.",
    notFoundHomeLink: "Back to homepage",

    searchTitle: "Search",
    searchEyebrow: "Search",
    searchLabel: "Search term",
    searchSubmit: "Search",
    searchResultsFor: (query) => `Results for “${query}”`,
    searchPages: "Pages",
    searchPosts: "News",
    searchEmpty: "No results found.",
    searchPrompt: "Enter a search term.",
    loadMorePages: "Show more pages",

    previewNotice: "Previewing unpublished content.",
    previewExit: "Exit preview",
  },
};

export function getChromeCopy(language) {
  return CHROME_COPY[language] ?? CHROME_COPY.hr;
}
