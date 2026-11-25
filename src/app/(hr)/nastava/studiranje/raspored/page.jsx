import TimetablePage from "@/components/timetable/TimetablePage";
import { TIMETABLE_URI } from "@/lib/timetable";
import { buildPageMetadata } from "@/lib/seo";

// Hardcoded route — takes precedence over the WordPress page at the same
// uri (the [...slug] catch-all). Data comes from Sceduly (src/lib/sceduly.js).
export const metadata = buildPageMetadata({
  language: "hr",
  uri: TIMETABLE_URI,
  title: "Raspored nastave",
  description: "Tjedni raspored nastave Pomorskog fakulteta u Splitu po studiju, nastavniku ili dvorani.",
});

export default function RasporedPage({ searchParams }) {
  return <TimetablePage searchParams={searchParams} />;
}
