import { getTimetableData } from "@/lib/sceduly";
import { nameKey, parseConsultations } from "@/lib/consultations";
import Consultations from "./Consultations";

const TIMETABLE_PATH = "/nastava/studiranje/raspored";

// Lecturer → their timetable (Raspored, lecturer view). Sceduly is cached
// for the day; if it can't be reached the rows simply have no link.
async function getTimetableLinks() {
  try {
    const data = await getTimetableData();
    const links = new Map();
    data.events.forEach((event) =>
      event.lecturerIds.forEach((id, index) => {
        links.set(nameKey(event.lecturers[index]), `${TIMETABLE_PATH}?nastavnik=${encodeURIComponent(id)}`);
      }),
    );
    return links;
  } catch {
    return new Map();
  }
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
