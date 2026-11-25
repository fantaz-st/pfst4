// Every search control on the site opens the same full-screen search layer
// (SearchOverlay), which SiteHeader owns. Controls outside the header fire
// this event; SiteHeader handles it synchronously, so the input is focused
// inside the tap itself (iOS only opens the keyboard then).
export const OPEN_SEARCH_EVENT = "pfst:open-search";

export function openSiteSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}
