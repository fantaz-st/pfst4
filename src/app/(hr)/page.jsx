import HomePage from "@/features/home/HomePage";
import { buildPageMetadata, SITE, toAbsoluteUrl } from "@/lib/seo";

const LANGUAGE = "hr";

export const metadata = buildPageMetadata({
  language: LANGUAGE,
  uri: "/",
  title: { absolute: SITE.hr.name },
  languages: { hr: toAbsoluteUrl("/"), en: toAbsoluteUrl("/en/"), "x-default": toAbsoluteUrl("/") },
});

export default function Home() {
  return <HomePage language={LANGUAGE} />;
}
