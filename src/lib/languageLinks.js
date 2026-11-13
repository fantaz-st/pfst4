import { localizedHomeUri } from "./language";

const LANGUAGES = [
  { code: "hr", label: "Hrvatski" },
  { code: "en", label: "English" },
];

// HR / EN switch targets: the current page's Polylang counterpart when one
// exists, otherwise that language's homepage.
export function getLanguageLinks(currentLanguage, translations) {
  return LANGUAGES.map(({ code, label }) => {
    const current = code === currentLanguage;
    const translation = translations?.find(
      (item) => item.language?.code?.toLowerCase() === code,
    );
    return {
      code,
      label,
      current,
      href: current ? null : translation?.uri ?? localizedHomeUri(code),
    };
  });
}
