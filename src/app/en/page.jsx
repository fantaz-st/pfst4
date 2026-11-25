import HomePage from "@/features/home/HomePage";
import { buildPageMetadata, SITE, toAbsoluteUrl } from "@/lib/seo";

const LANGUAGE = "en";

export const metadata = buildPageMetadata({
  language: LANGUAGE,
  uri: "/en/",
  title: { absolute: SITE.en.name },
  languages: { hr: toAbsoluteUrl("/"), en: toAbsoluteUrl("/en/"), "x-default": toAbsoluteUrl("/") },
});

export default function EnglishHome() {
  return <HomePage language={LANGUAGE} />;
}
