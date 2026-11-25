import { getTimetableData } from "@/lib/sceduly";
import { nameKey, parseConsultations } from "@/features/consultations/consultations";
import { TIMETABLE_URI } from "@/lib/timetable";
import Consultations from "./Consultations";

// Lecturer → their timetable (Raspored, lecturer view). Sceduly is cached
// for the day; if it can't be reached (null) the rows simply have no link.
async function getTimetableLinks() {
  const links = new Map();
  const data = await getTimetableData();
  if (!data) return links;
  data.events.forEach((event) =>
    event.lecturerIds.forEach((id, index) => {
      links.set(nameKey(event.lecturers[index]), `${TIMETABLE_URI}?nastavnik=${encodeURIComponent(id)}`);
    }),
  );
  return links;
}

/**
 * The "konzultacije" table block (blocks/Table.jsx hands it over): the
 * table's rows as searchable, filterable entries.
 */
export default async function ConsultationsBlock({ block, language = "hr" }) {
  const entries = parseConsultations(block.attributes);
  if (entries.length === 0) return null;
  const links = await getTimetableLinks();

  return (
    <Consultations
      language={language}
      entries={entries.map((entry, index) => ({
        ...entry,
        id: index,
        timetableHref: links.get(nameKey(entry.name)) ?? null,
      }))}
    />
  );
}
