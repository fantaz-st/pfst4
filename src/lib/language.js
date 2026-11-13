export const DEFAULT_LANGUAGE = "hr";

// Polylang has no URL prefix for the default language (hr); every other
// language is prefixed, e.g. /en/o-nama/.
export function getLanguageFromUri(uri) {
  const [first] = uri.split("/").filter(Boolean);
  return first === "en" ? "en" : DEFAULT_LANGUAGE;
}

// Polylang's language field first; the uri prefix as a fallback (preview
// drafts may have neither a language nor a stable uri yet).
export function getNodeLanguage(node) {
  const slug = node?.language?.slug;
  if (slug === "en" || slug === DEFAULT_LANGUAGE) return slug;
  return node?.uri ? getLanguageFromUri(node.uri) : DEFAULT_LANGUAGE;
}

export function toLanguageCodeEnum(language) {
  return language.toUpperCase();
}

export function localizedHomeUri(language) {
  return language === "en" ? "/en/" : "/";
}
