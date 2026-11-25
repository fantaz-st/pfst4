// Pure timetable helpers (no Sceduly access) — dates are "YYYY-MM-DD"
// strings, handled in UTC so the server's own timezone never shifts a day.

// The hardcoded Raspored route (app/(hr)/nastava/studiranje/raspored).
export const TIMETABLE_URI = "/nastava/studiranje/raspored";

export const TEACHING_TYPES = {
  P: "Predavanja",
  A: "Auditorne vježbe",
  L: "Laboratorijske vježbe",
  T: "Terenska nastava", // TODO: confirm with the faculty what "T" means
  TJ: "Tjelesna i zdravstvena kultura",
};

const DAY_NAMES = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"];
const DAY_SHORT = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

const toDate = (iso) => new Date(`${iso}T00:00:00Z`);
const toIso = (date) => date.toISOString().slice(0, 10);

export function addDays(iso, days) {
  const date = toDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

// 0 = Monday … 6 = Sunday
export const weekdayOf = (iso) => (toDate(iso).getUTCDay() + 6) % 7;

export const mondayOf = (iso) => addDays(iso, -weekdayOf(iso));

export const isIsoDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(toDate(value).getTime());

export function todayInZagreb() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zagreb", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export const formatDay = (iso) => {
  const [, month, day] = iso.split("-").map(Number);
  return `${day}. ${month}.`;
};

// selection.program is the programme object; selection.year (1, 2, 3…)
// keeps only its subjects taught in that year.
export function filterEvents(events, selection) {
  if (selection.program) {
    const { id, years } = selection.program;
    return events.filter((event) => event.programs.includes(id) && (!selection.year || years[event.subjectId] === selection.year));
  }
  if (selection.lecturer) return events.filter((event) => event.lecturerIds.includes(selection.lecturer));
  if (selection.room) return events.filter((event) => event.room === selection.room);
  return [];
}

// A multi-day event repeats weekly on its start date's weekday (skipping
// holidays); a single-day event happens once.
export function buildWeek(events, monday, holidays) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(monday, index);
    return { date, index, name: DAY_NAMES[index], short: DAY_SHORT[index], holiday: holidays[date] ?? null, events: [] };
  });

  events.forEach((event) => {
    if (event.from === event.to) {
      const day = days.find((candidate) => candidate.date === event.from);
      if (day) day.events.push(event);
      return;
    }
    const day = days[weekdayOf(event.from)];
    if (day.date >= event.from && day.date <= event.to && !day.holiday) day.events.push(event);
  });

  days.forEach((day) => day.events.sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end)));

  // Mon–Fri always; Saturday and Sunday only when something is on.
  return days.filter((day) => day.index < 5 || day.events.length);
}
