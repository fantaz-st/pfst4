// Slug -> official UN Sustainable Development Goal number and color.
// The goal number isn't stored in WordPress, so this is the source of truth
// for ordering and coloring the ciljevi filter grid and badges.
export const CILJEVI_META = {
  "svijet-bez-siromastva": { number: 1, color: "#E5243B" },
  "svijet-bez-gladi": { number: 2, color: "#DDA63A" },
  "zdravlje-i-blagostanje": { number: 3, color: "#4C9F38" },
  "kvalitetno-obrazovanje": { number: 4, color: "#C5192D" },
  "ravnopravnost-spolova": { number: 5, color: "#FF3A21" },
  "cista-voda-i-sanitarni-uvjeti": { number: 6, color: "#26BDE2" },
  "pristupacna-i-cista-energija": { number: 7, color: "#FCC30B" },
  "dostojanstven-rad-i-gospodarski-rast": { number: 8, color: "#A21942" },
  "industrija-inovacije-i-infrastruktura": { number: 9, color: "#FD6925" },
  "smanjenje-nejednakosti": { number: 10, color: "#DD1367" },
  "odrzivi-gradovi-i-zajednice": { number: 11, color: "#FD9D24" },
  "odgovornija-potrosnja-i-proizvodnja": { number: 12, color: "#BF8B2E" },
  "odgovor-na-klimatske-promjene": { number: 13, color: "#3F7E44" },
  "ocuvanje-vodenog-svijeta": { number: 14, color: "#0A97D9" },
  "ocuvanje-zivota-na-kopnu": { number: 15, color: "#56C02B" },
  "mir-pravda-i-snazne-institucije": { number: 16, color: "#00689D" },
  "partnerstvom-do-ciljeva": { number: 17, color: "#19486A" },
};

export function getCiljMeta(slug) {
  return CILJEVI_META[slug] ?? null;
}

export function sortByGoalNumber(terms) {
  return [...terms].sort(
    (a, b) => (getCiljMeta(a.slug)?.number ?? 99) - (getCiljMeta(b.slug)?.number ?? 99),
  );
}
