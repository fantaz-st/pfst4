// ciljevi = the 17 UN Sustainable Development Goals (CLAUDE.md). WordPress
// doesn't store the goal number, so this maps term slug → number + the
// official icon from public/ciljevi/ (hr/ for Croatian, E-WEB-Goal-* for
// English). No colours: the icons carry the official palette themselves.
import hr1 from "../../../public/ciljevi/hr/sdg-1_hr_ikona.png";
import hr2 from "../../../public/ciljevi/hr/sdg-2_hr_ikona.png";
import hr3 from "../../../public/ciljevi/hr/sdg-3_hr_ikona.png";
import hr4 from "../../../public/ciljevi/hr/sdg-4_hr_ikona.png";
import hr5 from "../../../public/ciljevi/hr/sdg-5_hr_ikona.png";
import hr6 from "../../../public/ciljevi/hr/sdg-6_hr_ikona.png";
import hr7 from "../../../public/ciljevi/hr/sdg-7_hr_ikona.png";
import hr8 from "../../../public/ciljevi/hr/sdg-8_hr_ikona.png";
import hr9 from "../../../public/ciljevi/hr/sdg-9_hr_ikona.png";
import hr10 from "../../../public/ciljevi/hr/sdg-10_hr_ikona.png";
import hr11 from "../../../public/ciljevi/hr/sdg-11_hr_ikona.png";
import hr12 from "../../../public/ciljevi/hr/sdg-12_hr_ikona.png";
import hr13 from "../../../public/ciljevi/hr/sdg-13_hr_ikona.png";
import hr14 from "../../../public/ciljevi/hr/sdg-14_hr_ikona.png";
import hr15 from "../../../public/ciljevi/hr/sdg-15_hr_ikona.png";
import hr16 from "../../../public/ciljevi/hr/sdg-16_hr_ikona.png";
import hr17 from "../../../public/ciljevi/hr/sdg-17_hr_ikona.png";
import en1 from "../../../public/ciljevi/E-WEB-Goal-01.png";
import en2 from "../../../public/ciljevi/E-WEB-Goal-02.png";
import en3 from "../../../public/ciljevi/E-WEB-Goal-03.png";
import en4 from "../../../public/ciljevi/E-WEB-Goal-04.png";
import en5 from "../../../public/ciljevi/E-WEB-Goal-05.png";
import en6 from "../../../public/ciljevi/E-WEB-Goal-06.png";
import en7 from "../../../public/ciljevi/E-WEB-Goal-07.png";
import en8 from "../../../public/ciljevi/E-WEB-Goal-08.png";
import en9 from "../../../public/ciljevi/E-WEB-Goal-09.png";
import en10 from "../../../public/ciljevi/E-WEB-Goal-10.png";
import en11 from "../../../public/ciljevi/E-WEB-Goal-11.png";
import en12 from "../../../public/ciljevi/E-WEB-Goal-12.png";
import en13 from "../../../public/ciljevi/E-WEB-Goal-13.png";
import en14 from "../../../public/ciljevi/E-WEB-Goal-14.png";
import en15 from "../../../public/ciljevi/E-WEB-Goal-15.png";
import en16 from "../../../public/ciljevi/E-WEB-Goal-16.png";
import en17 from "../../../public/ciljevi/E-WEB-Goal-17.png";

const ICONS = {
  hr: [null, hr1, hr2, hr3, hr4, hr5, hr6, hr7, hr8, hr9, hr10, hr11, hr12, hr13, hr14, hr15, hr16, hr17],
  en: [null, en1, en2, en3, en4, en5, en6, en7, en8, en9, en10, en11, en12, en13, en14, en15, en16, en17],
};

const GOAL_NUMBERS = {
  "svijet-bez-siromastva": 1,
  "svijet-bez-gladi": 2,
  "zdravlje-i-blagostanje": 3,
  "kvalitetno-obrazovanje": 4,
  "ravnopravnost-spolova": 5,
  "cista-voda-i-sanitarni-uvjeti": 6,
  "pristupacna-i-cista-energija": 7,
  "dostojanstven-rad-i-gospodarski-rast": 8,
  "industrija-inovacije-i-infrastruktura": 9,
  "smanjenje-nejednakosti": 10,
  "odrzivi-gradovi-i-zajednice": 11,
  "odgovornija-potrosnja-i-proizvodnja": 12,
  "odgovor-na-klimatske-promjene": 13,
  "ocuvanje-vodenog-svijeta": 14,
  "ocuvanje-zivota-na-kopnu": 15,
  "mir-pravda-i-snazne-institucije": 16,
  "partnerstvom-do-ciljeva": 17,
  "odgovornija-potrosnja-i-proizvodnja": 12,
};

export function getGoalNumber(slug) {
  return GOAL_NUMBERS[slug] ?? null;
}

/** Static image import (src + dimensions) for next/image, or null. */
export function getGoalIcon(slug, language = "hr") {
  const number = getGoalNumber(slug);
  if (!number) return null;
  return (ICONS[language] ?? ICONS.hr)[number];
}

export function sortByGoalNumber(terms) {
  return [...terms].sort((a, b) => (getGoalNumber(a.slug) ?? 99) - (getGoalNumber(b.slug) ?? 99));
}
