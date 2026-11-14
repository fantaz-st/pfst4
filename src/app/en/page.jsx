import HomePage from "@/components/home/HomePage";

const LANGUAGE = "en";

export const metadata = {
  title: "Faculty of Maritime Studies, University of Split",
  description:
    "Faculty of Maritime Studies, University of Split — nautical studies, marine engineering, marine electrical technologies and maritime management.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/en/` },
};

export default function EnglishHome() {
  return <HomePage language={LANGUAGE} />;
}
