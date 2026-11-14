import HomePage from "@/components/home/HomePage";

const LANGUAGE = "hr";

export const metadata = {
  title: "Pomorski fakultet u Splitu",
  description:
    "Pomorski fakultet Sveučilišta u Splitu — studiji pomorstva, brodostrojarstva, elektrotehničkih tehnologija i pomorskog menadžmenta.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
};

export default function Home() {
  return <HomePage language={LANGUAGE} />;
}
