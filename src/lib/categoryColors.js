export const CATEGORY_COLOR_VARIANTS = {
  "bez-kategorije": "bez-kategorije",
  natjecaji: "natjecaji",
  najave: "najave",
  nastava: "nastava",
  projekti: "projekti",
  referada: "referada",
  savjetovanja: "savjetovanja",
  sluzbeno: "sluzbeno",
  erasmus: "erasmus",
  istaknuto: "istaknuto",
  stipendije: "stipendije",
};

export function getCategoryColorVariant(category) {
  return CATEGORY_COLOR_VARIANTS[category?.slug] ?? "neutral";
}
