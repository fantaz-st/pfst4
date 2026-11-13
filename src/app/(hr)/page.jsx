import SiteChrome from "@/components/layout/SiteChrome";
import Hero from "@/components/layout/Hero";

const LANGUAGE = "hr";

export const metadata = {
  title: "Pomorski fakultet u Splitu",
  description:
    "Pomorski fakultet Sveučilišta u Splitu — studiji pomorstva, brodostrojarstva, elektrotehničkih tehnologija i pomorskog menadžmenta.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
};

// TODO: homepage sections arrive in phase 5. Placeholder only.
export default function Home() {
  return (
    <SiteChrome language={LANGUAGE}>
      <Hero size="home" photo={{ tag: "Video · TODO školski brod / kampus iz zraka" }}>
        <h1>Pomorski fakultet u Splitu</h1>
      </Hero>
    </SiteChrome>
  );
}
