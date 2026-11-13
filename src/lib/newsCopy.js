// UI strings for news (archive, filters, post page, lists), keyed by language.
const NEWS_COPY = {
  hr: {
    archiveTitle: "Novosti",
    archiveEyebrow: "Obavijesti",
    archiveLead: "Službene obavijesti, natječaji i najave događanja.",
    archiveMetaTitle: "Novosti — Pomorski fakultet u Splitu",
    archiveMetaDescription:
      "Obavijesti, natječaji i najave Pomorskog fakulteta u Splitu.",
    filterByCategoryLabel: "Filtriraj novosti",
    allFilter: "Sve",
    featuredFilter: "Istaknuto",
    filterByGoalsLegend: "Ciljevi održivog razvoja",
    searchLabel: "Pretraži novosti",
    dateFrom: "Od datuma",
    dateTo: "Do datuma",
    applyFilters: "Primijeni",
    clearFilters: "Poništi filtre",
    loadMore: "Prikaži još obavijesti",
    loading: "Učitavanje…",
    emptyList: "Nema obavijesti za odabrane filtre.",
    goalsHeading: "Ciljevi održivog razvoja",
    goalLink: (name) => `Novosti za cilj: ${name}`,
    relatedHeading: "Vezane vijesti",
    published: "Objavljeno",
  },
  en: {
    archiveTitle: "News",
    archiveEyebrow: "Announcements",
    archiveLead: "Official announcements, calls and upcoming events.",
    archiveMetaTitle: "News — Faculty of Maritime Studies, University of Split",
    archiveMetaDescription:
      "Announcements, calls and news from the Faculty of Maritime Studies, University of Split.",
    filterByCategoryLabel: "Filter news",
    allFilter: "All",
    featuredFilter: "Featured",
    filterByGoalsLegend: "Sustainable Development Goals",
    searchLabel: "Search news",
    dateFrom: "From",
    dateTo: "To",
    applyFilters: "Apply",
    clearFilters: "Clear filters",
    loadMore: "Show more announcements",
    loading: "Loading…",
    emptyList: "No announcements match the selected filters.",
    goalsHeading: "Sustainable Development Goals",
    goalLink: (name) => `News for goal: ${name}`,
    relatedHeading: "Related news",
    published: "Published",
  },
};

export function getNewsCopy(language) {
  return NEWS_COPY[language] ?? NEWS_COPY.hr;
}
