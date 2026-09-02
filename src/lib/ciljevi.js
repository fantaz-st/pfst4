import goal01 from "../../public/ciljevi/hr/sdg-1_hr_ikona.png";
import goal02 from "../../public/ciljevi/hr/sdg-2_hr_ikona.png";
import goal03 from "../../public/ciljevi/hr/sdg-3_hr_ikona.png";
import goal04 from "../../public/ciljevi/hr/sdg-4_hr_ikona.png";
import goal05 from "../../public/ciljevi/hr/sdg-5_hr_ikona.png";
import goal06 from "../../public/ciljevi/hr/sdg-6_hr_ikona.png";
import goal07 from "../../public/ciljevi/hr/sdg-7_hr_ikona.png";
import goal08 from "../../public/ciljevi/hr/sdg-8_hr_ikona.png";
import goal09 from "../../public/ciljevi/hr/sdg-9_hr_ikona.png";
import goal10 from "../../public/ciljevi/hr/sdg-10_hr_ikona.png";
import goal11 from "../../public/ciljevi/hr/sdg-11_hr_ikona.png";
import goal12 from "../../public/ciljevi/hr/sdg-12_hr_ikona.png";
import goal13 from "../../public/ciljevi/hr/sdg-13_hr_ikona.png";
import goal14 from "../../public/ciljevi/hr/sdg-14_hr_ikona.png";
import goal15 from "../../public/ciljevi/hr/sdg-15_hr_ikona.png";
import goal16 from "../../public/ciljevi/hr/sdg-16_hr_ikona.png";
import goal17 from "../../public/ciljevi/hr/sdg-17_hr_ikona.png";

// Slug -> official UN Sustainable Development Goal number and color.
// The goal number isn't stored in WordPress, so this is the source of truth
// for ordering and coloring the ciljevi filter grid and badges.
export const CILJEVI_META = {
  "svijet-bez-siromastva": { number: 1, color: "#E5243B", icon: goal01 },
  "svijet-bez-gladi": { number: 2, color: "#DDA63A", icon: goal02 },
  "zdravlje-i-blagostanje": { number: 3, color: "#4C9F38", icon: goal03 },
  "kvalitetno-obrazovanje": { number: 4, color: "#C5192D", icon: goal04 },
  "ravnopravnost-spolova": { number: 5, color: "#FF3A21", icon: goal05 },
  "cista-voda-i-sanitarni-uvjeti": {
    number: 6,
    color: "#26BDE2",
    icon: goal06,
  },
  "pristupacna-i-cista-energija": { number: 7, color: "#FCC30B", icon: goal07 },
  "dostojanstven-rad-i-gospodarski-rast": {
    number: 8,
    color: "#A21942",
    icon: goal08,
  },
  "industrija-inovacije-i-infrastruktura": {
    number: 9,
    color: "#FD6925",
    icon: goal09,
  },
  "smanjenje-nejednakosti": { number: 10, color: "#DD1367", icon: goal10 },
  "odrzivi-gradovi-i-zajednice": { number: 11, color: "#FD9D24", icon: goal11 },
  "odgovornija-potrosnja-i-proizvodnja": {
    number: 12,
    color: "#BF8B2E",
    icon: goal12,
  },
  "odgovor-na-klimatske-promjene": {
    number: 13,
    color: "#3F7E44",
    icon: goal13,
  },
  "ocuvanje-vodenog-svijeta": { number: 14, color: "#0A97D9", icon: goal14 },
  "ocuvanje-zivota-na-kopnu": { number: 15, color: "#56C02B", icon: goal15 },
  "mir-pravda-i-snazne-institucije": {
    number: 16,
    color: "#00689D",
    icon: goal16,
  },
  "partnerstvom-do-ciljeva": { number: 17, color: "#19486A", icon: goal17 },
};

export function getCiljMeta(slug) {
  return CILJEVI_META[slug] ?? null;
}

export function sortByGoalNumber(terms) {
  return [...terms].sort(
    (a, b) =>
      (getCiljMeta(a.slug)?.number ?? 99) - (getCiljMeta(b.slug)?.number ?? 99),
  );
}
