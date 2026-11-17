// Sceduly REST API — server only (node:crypto keeps it out of client bundles).
// Docs: https://sceduly.com/api/ — the live responses differ from the docs in
// places (events keyed by ID, `facility` instead of `classroom`, empty
// objects sent as []), so everything goes through normalizeEvent() below.
//
// Auth: every request carries user, institutionID and an HMAC-SHA256
// signature of "GET\r\n{institutionID}\r\n{path}\r\n{YYYY-MM-DD HH:mm}"
// (Croatian local time), keyed with the password.
//
// Sceduly allows ONE sync per day. The signature changes every minute, so
// Next's fetch cache would see a new URL each time and never hit — the
// normalized result is cached with unstable_cache instead (one sync a day:
// 3 requests, then one /programs?programID= per study programme).
import { createHmac } from "node:crypto";
import { unstable_cache } from "next/cache";

const BASE = "https://api.sceduly.com";
const DAY = 60 * 60 * 24;

function zagrebNow(withTime) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Zagreb",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime && { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
  }).format(new Date());
}

// Throws on any failure so unstable_cache never stores a failed response.
async function scedulyGet(path, params = {}) {
  const { SCEDULY_USER: user, SCEDULY_INSTITUTION_ID: institutionID, SCEDULY_PASSWORD: password } = process.env;
  if (!user || !institutionID || !password) throw new Error("Sceduly env vars missing");

  const data = ["GET", institutionID, path, zagrebNow(true)].join("\r\n");
  const signature = createHmac("sha256", password).update(data).digest("hex");
  const query = new URLSearchParams({ user, institutionID, signature, ...params });

  const res = await fetch(`${BASE}${path}?${query}`);
  if (!res.ok) throw new Error(`Sceduly ${path}: HTTP ${res.status}`);
  return res.json();
}

// PHP-style payloads: a keyed object, a plain array, or [] for "empty".
const list = (value) => (Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : []);

// Academic year: 1 Sept – 31 Aug. Stable all year, so one cache entry.
function academicYear(today) {
  const [year, month] = today.split("-").map(Number);
  const start = month >= 9 ? year : year - 1;
  return { startDate: `${start}-09-01`, endDate: `${start + 1}-08-31` };
}

function normalizeEvent(event) {
  const embedded = event._embedded ?? {};
  const lecturers = list(embedded.lecturers);
  return {
    id: String(event.eventID),
    subjectId: String(event.subjectID),
    subject: embedded.subject?.subjectName ?? "",
    groupId: String(event.groupID ?? "0"),
    type: event.teachingType ?? "",
    room: embedded.facility?.facilityName ?? "",
    lecturers: lecturers.map((lecturer) => `${lecturer.firstName} ${lecturer.lastName}`),
    lecturerIds: lecturers.map((lecturer) => String(lecturer.userID)),
    programs: [...new Set(list(embedded.programs).flatMap(list).map((program) => String(program.programID)))],
    from: event.startDate,
    to: event.endDate,
    start: event.startTime,
    end: event.endTime,
  };
}

// Year of study per subject: the timetable has no semester, but each
// programme version lists its subjects by semester. The newest version is
// used; its subject IDs match the current events of every year. Module
// subjects ("Uvodni razlikovni program") are left out — Sceduly lists them
// separately, so they show only under "Sve godine".
function yearsBySubject(detail) {
  const embedded = list(detail)[0]?._embedded ?? {};
  const groups = list(embedded.subjectGroups);
  const years = {};
  groups.forEach((group) => {
    const year = Math.ceil(Number(group.semester) / 2);
    if (!year) return;
    list(group.subjects).forEach((subject) => {
      years[String(subject.subjectID)] ??= year;
    });
  });
  return years;
}

// Sceduly labels groups "Grupa 1 (L-8813)": numbered per subject and
// teaching type in group-ID order. groupID 0 = the whole year. A few
// subjects also carry an older group set (IDs thousands lower, e.g. 4410–
// 4417 next to 8805–8823); Sceduly shows those without a label, so only the
// newest block of IDs is numbered.
function withGroupNumbers(events) {
  const ids = {};
  events.forEach((event) => {
    if (event.groupId === "0") return;
    (ids[`${event.subjectId}|${event.type}`] ??= new Set()).add(Number(event.groupId));
  });
  const numbered = {};
  Object.entries(ids).forEach(([key, set]) => {
    const sorted = [...set].sort((a, b) => a - b);
    let blockStart = 0;
    sorted.forEach((id, index) => {
      if (index && id - sorted[index - 1] > 1000) blockStart = index;
    });
    numbered[key] = sorted.slice(blockStart);
  });
  return events.map(({ groupId, ...event }) => {
    const index = groupId === "0" ? -1 : numbered[`${event.subjectId}|${event.type}`].indexOf(Number(groupId));
    return { ...event, group: index === -1 ? null : index + 1 };
  });
}

const newestVersion = (program) =>
  list(program.versions).reduce((best, version) => (Number(version.startYear) > Number(best.startYear) ? version : best), program);

async function loadTimetable() {
  const range = academicYear(zagrebNow(false));
  // Sceduly allows at most 10 concurrent connections: 3 now, then one per programme.
  const [overview, holidays, programs] = await Promise.all([
    scedulyGet("/timetable/overview", { location: process.env.SCEDULY_LOCATION, ...range }),
    scedulyGet("/timetable/holidays"),
    scedulyGet("/programs"),
  ]);
  const programList = list(programs);
  const events = list(overview)
    .filter((event) => String(event.subjectID) !== "0")
    .map(normalizeEvent);
  const details = await Promise.all(
    programList.map((program) => scedulyGet("/programs", { programID: String(newestVersion(program).programID) })),
  );

  return {
    updated: zagrebNow(true),
    // subjectID 0 = room reservations ("Reservation - PFST"), not classes.
    events: withGroupNumbers(events),
    holidays: holidays && !Array.isArray(holidays) ? holidays : {},
    programs: programList.map((program, index) => {
      const years = yearsBySubject(details[index]);
      return {
        id: String(program.programID),
        code: (program.uniqueID ?? "").replace(/^D_/, ""),
        name: program.programName,
        graduate: program.level === "7.0",
        years,
        yearCount: Math.max(0, ...Object.values(years)),
      };
    }),
  };
}

const cachedTimetable = unstable_cache(loadTimetable, ["sceduly-timetable"], { revalidate: DAY, tags: ["sceduly"] });

/** @returns {Promise<null | { updated: string, events: object[], holidays: Record<string, string>, programs: object[] }>} */
export async function getTimetableData() {
  try {
    return await cachedTimetable();
  } catch (error) {
    console.error(error);
    return null;
  }
}
