// Dates in the design's format (STYLEGUIDE §9): "09. 11. 2026." in
// Croatian, "09/11/2026" in English. Render with the .num class.
const LOCALES = { hr: "hr-HR", en: "en-GB" };

export function formatDate(value, language = "hr") {
  if (!value) return "";
  return new Intl.DateTimeFormat(LOCALES[language] ?? LOCALES.hr, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Zagreb",
  }).format(new Date(value));
}
