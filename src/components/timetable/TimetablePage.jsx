import { Suspense } from "react";
import Link from "next/link";
import PageHero from "@/components/content/PageHero";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { getTimetableData } from "@/lib/sceduly";
import { addDays, buildWeek, filterEvents, formatDay, isIsoDate, mondayOf, todayInZagreb } from "@/lib/timetable";
import TimetableControls from "./TimetableControls";
import TimetableWeek from "./TimetableWeek";
import TimetableExport from "./TimetableExport";
import TimetableMemory from "@/components/personal/TimetableMemory";
import styles from "./TimetablePage.module.css";

export const TIMETABLE_URI = "/nastava/studiranje/raspored";

const COPY = {
  title: "Raspored nastave",
  eyebrow: "Studiranje",
  lead: "Tjedni raspored predavanja i vježbi po studiju, nastavniku ili dvorani.",
  unavailable: "Raspored trenutačno nije dostupan. Pokušajte ponovno kasnije.",
  pick: "Odaberite studij, nastavnika ili dvoranu za prikaz rasporeda.",
  empty: "Nema nastave u ovom tjednu.",
  prev: "Prethodni tjedan",
  next: "Sljedeći tjedan",
  thisWeek: "Ovaj tjedan",
  updated: "Podaci iz sustava Sceduly, osvježeno",
  faculty: "Pomorski fakultet u Splitu",
};

const SHEET_ID = "raspored-ispis";

// "Pomorska nautika · 1. godina" → "pomorska-nautika-1-godina" (file names).
const slug = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const single = (value) => (typeof value === "string" && value ? value : undefined);

function hrefFor(params, week) {
  const query = new URLSearchParams(params);
  query.set("tjedan", week);
  return `${TIMETABLE_URI}?${query}`;
}

export default async function TimetablePage({ searchParams }) {
  const params = await searchParams;
  const data = await getTimetableData();

  const hero = <PageHero title={COPY.title} eyebrow={COPY.eyebrow} lead={COPY.lead} crumbs={[{ label: "Nastava", uri: "/nastava" }, { label: "Studiranje", uri: "/nastava/studiranje" }]} />;

  if (!data) {
    return (
      <>
        {hero}
        <div className={styles.wrap}>
          <p className={styles.message}>{COPY.unavailable}</p>
        </div>
      </>
    );
  }

  const today = todayInZagreb();
  const currentMonday = mondayOf(today);
  const week = isIsoDate(params.tjedan) ? mondayOf(params.tjedan) : currentMonday;
  const program = data.programs.find((item) => item.id === single(params.studij));
  // A programme opens on its 1st year; ?godina=sve shows all years.
  const requestedYear = Number(params.godina);
  const year =
    !program || !program.yearCount || params.godina === "sve"
      ? undefined
      : requestedYear >= 1 && requestedYear <= program.yearCount
        ? requestedYear
        : 1;
  const selection = { program, year, lecturer: single(params.nastavnik), room: single(params.dvorana) };
  const selectionParams = Object.fromEntries(
    Object.entries({ studij: program?.id, godina: program && (year ?? "sve"), nastavnik: selection.lecturer, dvorana: selection.room }).filter(([, value]) => value),
  );
  const hasSelection = Boolean(program || selection.lecturer || selection.room);

  // The client gets programme names only — the subject → year maps stay here.
  const programs = data.programs
    .filter((item) => data.events.some((event) => event.programs.includes(item.id)))
    .map(({ id, name, graduate, yearCount }) => ({ id, name, graduate, yearCount }));
  const lecturers = [...new Map(data.events.flatMap((event) => event.lecturerIds.map((id, index) => [id, event.lecturers[index]]))).entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.split(" ").at(-1).localeCompare(b.name.split(" ").at(-1), "hr"));
  const rooms = [...new Set(data.events.map((event) => event.room).filter(Boolean))].sort((a, b) => a.localeCompare(b, "hr", { numeric: true }));

  // "PN 1." / "PN dipl. 2." — shown on events in the lecturer and room views.
  const programLabel = (event) =>
    event.programs
      .map((id) => data.programs.find((item) => item.id === id))
      .filter(Boolean)
      .map((item) => [item.code, item.graduate && "dipl.", item.years[event.subjectId] && `${item.years[event.subjectId]}.`].filter(Boolean).join(" "))
      .join(", ");
  const filtered = hasSelection ? filterEvents(data.events, selection).map((event) => ({ ...event, programLabel: programLabel(event) })) : [];
  const days = hasSelection ? buildWeek(filtered, week, data.holidays) : [];
  const show = { program: !program, lecturer: !selection.lecturer, room: !selection.room };
  const friday = addDays(week, 4);
  const hasEvents = days.some((day) => day.events.length || day.holiday);

  // What the printout / image is of, e.g. "Pomorska nautika · 1. godina".
  const selectionLabel = program
    ? [program.graduate ? `${program.name} (diplomski)` : program.name, year ? `${year}. godina` : "sve godine"].join(" · ")
    : selection.lecturer
      ? lecturers.find((item) => item.id === selection.lecturer)?.name ?? ""
      : selection.room
        ? `Dvorana ${selection.room}`
        : "";
  const weekLabel = `${formatDay(week)} – ${formatDay(friday)} ${friday.slice(0, 4)}.`;

  return (
    <>
      {hero}
      <TimetableMemory query={new URLSearchParams(selectionParams).toString()} label={selectionLabel} basePath={TIMETABLE_URI} />
      <div className={styles.wrap}>
        <div className={styles.toolbar}>
          <Suspense>
            <TimetableControls
              programs={programs}
              lecturers={lecturers}
              rooms={rooms}
              selection={{ program: program?.id, year, lecturer: selection.lecturer, room: selection.room }}
              week={week}
              basePath={TIMETABLE_URI}
            />
          </Suspense>
          <nav className={styles.weekNav} aria-label="Tjedan">
            <Link href={hrefFor(selectionParams, addDays(week, -7))} className={styles.weekArrow} aria-label={COPY.prev} scroll={false}>
              <Icon name="arrow" size={18} className={styles.flip} />
            </Link>
            <span className={`${styles.weekLabel} num`}>
              {formatDay(week)} – {formatDay(friday)} <span className={styles.year}>{friday.slice(0, 4)}.</span>
            </span>
            <Link href={hrefFor(selectionParams, addDays(week, 7))} className={styles.weekArrow} aria-label={COPY.next} scroll={false}>
              <Icon name="arrow" size={18} />
            </Link>
            {week !== currentMonday && (
              <Button href={hrefFor(selectionParams, currentMonday)} variant="outline" size="s" scroll={false}>
                {COPY.thisWeek}
              </Button>
            )}
          </nav>
        </div>

        {hasEvents && (
          <div className={styles.exportBar}>
            <TimetableExport targetId={SHEET_ID} filename={`raspored-${slug(selectionLabel)}-${week}`} />
          </div>
        )}

        {!hasSelection ? (
          <p className={styles.message}>{COPY.pick}</p>
        ) : !hasEvents ? (
          <p className={styles.message}>{COPY.empty}</p>
        ) : (
          // The sheet is what prints and what the image captures; its header
          // only shows there (print / [data-exporting]).
          <div id={SHEET_ID} className={styles.sheet}>
            <div className={styles.sheetHead}>
              <span className={styles.sheetFaculty}>
                {COPY.faculty} · {COPY.title}
              </span>
              <span className={styles.sheetTitle}>{selectionLabel}</span>
              <span className={`${styles.sheetWeek} num`}>{weekLabel}</span>
            </div>
            <TimetableWeek days={days} today={today} show={show} />
          </div>
        )}

        <p className={styles.updated}>
          {COPY.updated} {data.updated.replace(/^(\d{4})-(\d{2})-(\d{2})/, (_, y, m, d) => `${Number(d)}. ${Number(m)}. ${y}.`)}
        </p>
      </div>
    </>
  );
}
