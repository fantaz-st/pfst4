import { wpFetch } from "./wp";
import { TRANSLATIONS_BY_URI } from "./queries";

export const DEFAULT_LANGUAGE = "hr";

// Polylang has no URL prefix for the default language (hr); every other
// language is prefixed, e.g. /en/o-nama/.
export function getLanguageFromUri(uri) {
  const [first] = uri.split("/").filter(Boolean);
  return first === "en" ? "en" : DEFAULT_LANGUAGE;
}

export function toLanguageCodeEnum(language) {
  return language.toUpperCase();
}

export function localizedHomeUri(language) {
  return language === "en" ? "/en/" : "/";
}

// WP uris always carry a trailing slash; request pathnames don't necessarily.
function toWpUri(pathname) {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

// Used by the Header's language switcher, which lives in the root layout and
// so has no direct access to the current page's node. Fetches just enough to
// build the switcher, not the full NODE_BY_URI (blocks, seo, etc).
export async function getTranslationsForUri(pathname) {
  const data = await wpFetch(
    TRANSLATIONS_BY_URI,
    { uri: toWpUri(pathname) },
    { tags: ["wp"] },
  );
  return data?.nodeByUri?.translations ?? null;
}
