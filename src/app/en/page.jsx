import SiteChrome from "@/components/layout/SiteChrome";
import Hero from "@/components/layout/Hero";

const LANGUAGE = "en";

export const metadata = {
  title: "Faculty of Maritime Studies, University of Split",
  description:
    "Faculty of Maritime Studies, University of Split — nautical studies, marine engineering, marine electrical technologies and maritime management.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/` },
};

// TODO: homepage sections arrive in phase 5. Placeholder only.
export default function EnglishHome() {
  return (
    <SiteChrome language={LANGUAGE}>
      <Hero size="home" photo={{ tag: "Video · TODO training ship / campus aerial" }}>
        <h1>Faculty of Maritime Studies</h1>
      </Hero>
    </SiteChrome>
  );
}
