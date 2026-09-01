// UI strings for the news components shared between the Croatian and
// English archives (NewsFilters, ObavijestiList, FeaturedGrid). Page-level
// headings live as literal JSX in each language's page.jsx instead, same as
// before this file existed.
const NEWS_COPY = {
  hr: {
    allFilter: "Sve",
    filterByCategoryLabel: "Filtriraj po kategoriji",
    filterByCiljeviLegend: "Filtriraj po ciljevima održivog razvoja",
    loadMore: "Učitaj više",
    loading: "Učitavanje…",
    emptyList: "Nema obavijesti za odabrane filtre.",
  },
  en: {
    allFilter: "All",
    filterByCategoryLabel: "Filter by category",
    filterByCiljeviLegend: "Filter by UN Sustainable Development Goals",
    loadMore: "Load more",
    loading: "Loading…",
    emptyList: "No announcements match the selected filters.",
  },
};

export function getNewsCopy(language) {
  return NEWS_COPY[language] ?? NEWS_COPY.hr;
}
