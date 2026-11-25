// Konzultacije: a WordPress table block with the class "konzultacije" →
// structured entries for the searchable view (features/consultations).
//
// Two column layouts are read:
// - the clean one: Nastavnik · Kabinet · Dan · Vrijeme · Dan · Vrijeme · Napomena
// - the office's Excel export: Prezime i ime · Dan · Vrijeme · Sala · Dan · Vrijeme · Sala
// "Prema dogovoru …" can sit in any cell; an email in the row becomes the
// contact link. A row that can't be read keeps its name and text, so no one
// disappears from the list.

import { searchKey } from "@/lib/fold";

export const DAYS = [
  { key: 0, short: "Pon", full: "Ponedjeljak", en: "Mon" },
  { key: 1, short: "Uto", full: "Utorak", en: "Tue" },
  { key: 2, short: "Sri", full: "Srijeda", en: "Wed" },
  { key: 3, short: "Čet", full: "Četvrtak", en: "Thu" },
  { key: 4, short: "Pet", full: "Petak", en: "Fri" },
];

const DAY_PREFIXES = [["pon", 0], ["uto", 1], ["sri", 2], ["čet", 3], ["cet", 3], ["pet", 4]];
const TIME = /(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/;
const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/;

const pad = (value) => String(value).padStart(2, "0");

function toText(html) {
  return String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function toDay(text) {
  const value = text.toLowerCase();
  return DAY_PREFIXES.find(([prefix]) => value.startsWith(prefix))?.[1] ?? null;
}

function toTime(text) {
  const match = text.match(TIME);
  if (!match) return null;
  return { from: `${pad(match[1])}:${match[2]}`, to: `${pad(match[3])}:${match[4]}` };
}

function slot(dayText, timeText) {
  const day = toDay(dayText);
  const time = toTime(timeText);
  return day === null || !time ? null : { day, ...time };
}

export { searchKey };

export function parseConsultations({ headers = [], rows = [] } = {}) {
  const clean = /kabinet/i.test(toText(headers[1]));

  return rows
    .map((row) => {
      const cells = row.map(toText);
      const name = cells[0];
      if (!name) return null;
      const whole = row.join(" ");
      const email = whole.match(EMAIL)?.[0] ?? "";
      const slots = (clean
        ? [slot(cells[2], cells[3]), slot(cells[4], cells[5])]
        : [slot(cells[1], cells[2]), slot(cells[4], cells[5])]
      ).filter(Boolean);
      const room = (clean ? cells[1] : cells[3] || cells[6]) || "";
      const note = clean
        ? cells[6]
        : slots.length === 0
          ? cells.slice(1).filter(Boolean).join(" ")
          : "";

      return {
        name,
        room: slots.length ? room : "",
        slots,
        byAgreement: /dogovor/i.test(note),
        note: note.replace(EMAIL, "").replace(/[:\s]+$/, "").trim(),
        email,
      };
    })
    .filter(Boolean);
}

// Sceduly names lecturers "First Last", the table "Last First": match on
// the set of name parts.
export function nameKey(name) {
  return searchKey(name).split(/[\s-]+/).filter(Boolean).sort().join(" ");
}
