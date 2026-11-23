"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { DAYS, searchKey } from "@/lib/consultations";
import { EMPTY_LIST, KEYS, toggleStarred, useStored } from "@/lib/personal";
import styles from "./Consultations.module.css";

const COPY = {
  hr: {
    label: "Konzultacije",
    search: "Traži nastavnika ili kabinet…",
    searchLabel: "Traži nastavnika ili kabinet",
    days: "Dan",
    allDays: "Svi dani",
    today: "danas",
    index: "Abecedni indeks",
    lecturer: "Nastavnik",
    room: "Kabinet",
    slot: (n) => `Termin ${n}`,
    count: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "nastavnik" : "nastavnika"}`,
    slotCount: (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "termin" : "termina"}`,
    morning: "Prijepodne",
    afternoon: "Poslijepodne",
    untilNoon: "do 12:00",
    fromNoon: "od 12:00",
    live: "U tijeku",
    byAgreement: "Prema dogovoru",
    timetable: (name) => `Raspored nastave: ${name}`,
    empty: "Nema rezultata za ovaj upit.",
    clear: "Prikaži sve",
    mine: "Moji nastavnici",
    star: (name) => `Označi: ${name}`,
    unstar: (name) => `Ukloni oznaku: ${name}`,
  },
  en: {
    label: "Office hours",
    search: "Search by name or office…",
    searchLabel: "Search by name or office",
    days: "Day",
    allDays: "All days",
    today: "today",
    index: "Alphabetical index",
    lecturer: "Lecturer",
    room: "Office",
    slot: (n) => `Slot ${n}`,
    count: (n) => `${n} ${n === 1 ? "lecturer" : "lecturers"}`,
    slotCount: (n) => `${n} ${n === 1 ? "slot" : "slots"}`,
    morning: "Morning",
    afternoon: "Afternoon",
    untilNoon: "until 12:00",
    fromNoon: "from 12:00",
    live: "Now",
    byAgreement: "By appointment",
    timetable: (name) => `Timetable: ${name}`,
    empty: "Nothing matches this search.",
    clear: "Show all",
    mine: "My lecturers",
    star: (name) => `Star ${name}`,
    unstar: (name) => `Unstar ${name}`,
  },
};

const ALL = "all";

// Monday = 0 … Friday = 4 in Zagreb; null at the weekend.
function zagrebNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Zagreb",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value]),
  );
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri"].indexOf(parts.weekday);
  return { day: day === -1 ? null : day, time: `${parts.hour}:${parts.minute}` };
}

function DayChip({ day, language }) {
  const info = DAYS[day];
  return <span className={styles.chip}>{language === "en" ? info.en : info.short}</span>;
}

// Starred lecturers ("Moji nastavnici") are saved in the browser.
function Star({ name, on, copy }) {
  return (
    <button
      type="button"
      className={styles.star}
      aria-pressed={on}
      aria-label={on ? copy.unstar(name) : copy.star(name)}
      onClick={() => toggleStarred(name)}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z" />
      </svg>
    </button>
  );
}

function TimetableLink({ entry, copy }) {
  if (!entry.timetableHref) return <span />;
  return (
    <a href={entry.timetableHref} className={styles.cal} aria-label={copy.timetable(entry.name)}>
      <Icon name="calendar" size={18} />
    </a>
  );
}

function Agreement({ entry, copy }) {
  return (
    <span className={styles.agreed}>
      <span className={styles.muted}>{entry.byAgreement ? copy.byAgreement : entry.note}</span>
      {entry.email && (
        <a href={`mailto:${entry.email}`} className={styles.mail}>
          <Icon name="mail" size={16} />
          {entry.email}
        </a>
      )}
    </span>
  );
}

/**
 * Konzultacije (design: "PFST — Konzultacije" canvas). All days: lecturers
 * A–Ž in letter groups with an index. One day: that day's slots by time,
 * split into morning / afternoon, the running ones marked when the day is
 * today. Search matches name or office, ignoring č/ć/š/ž/đ. Starred
 * lecturers are listed again on top as "Moji nastavnici".
 */
export default function Consultations({ entries, language = "hr" }) {
  const copy = COPY[language] ?? COPY.hr;
  const [query, setQuery] = useState("");
  const [day, setDay] = useState(ALL);
  const [now, setNow] = useState(null);
  const starredNames = useStored(KEYS.starred, EMPTY_LIST);
  const starred = useMemo(() => new Set(starredNames), [starredNames]);

  // Client clock only, so server and client render the same first frame.
  useEffect(() => {
    const tick = () => setNow(zagrebNow());
    tick();
    const timer = setInterval(tick, 60_000);
    return () => clearInterval(timer);
  }, []);

  const term = searchKey(query.trim());
  const matches = useMemo(
    () => (term ? entries.filter((entry) => searchKey(`${entry.name} ${entry.room}`).includes(term)) : entries),
    [entries, term],
  );

  const groups = useMemo(() => {
    const out = [];
    matches.forEach((entry) => {
      const letter = entry.name.charAt(0).toUpperCase();
      const last = out[out.length - 1];
      if (last?.letter === letter) last.entries.push(entry);
      else out.push({ letter, entries: [entry] });
    });
    return out;
  }, [matches]);

  const mine = useMemo(() => matches.filter((entry) => starred.has(entry.name)), [matches, starred]);

  const daySlots = useMemo(() => {
    if (day === ALL) return [];
    return matches
      .flatMap((entry) => entry.slots.filter((item) => item.day === day).map((item) => ({ ...item, entry })))
      .sort((a, b) => a.from.localeCompare(b.from) || a.entry.name.localeCompare(b.entry.name, "hr"));
  }, [matches, day]);

  const isToday = now && now.day === day;
  const letters = new Set(groups.map((group) => group.letter));
  const allLetters = [...new Set(entries.map((entry) => entry.name.charAt(0).toUpperCase()))];
  const parts =
    day === ALL
      ? []
      : [
          { key: "am", label: copy.morning, range: copy.untilNoon, items: daySlots.filter((item) => item.from < "12:00") },
          { key: "pm", label: copy.afternoon, range: copy.fromNoon, items: daySlots.filter((item) => item.from >= "12:00") },
        ].filter((part) => part.items.length > 0);
  const empty = day === ALL ? matches.length === 0 : daySlots.length === 0;

  return (
    <section className={styles.root} aria-label={copy.label}>
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <Icon name="search" size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            aria-label={copy.searchLabel}
          />
        </label>
        <div className={styles.days} role="group" aria-label={copy.days}>
          <button type="button" className={styles.day} aria-pressed={day === ALL} onClick={() => setDay(ALL)}>
            {copy.allDays}
          </button>
          {DAYS.map((info) => (
            <button
              key={info.key}
              type="button"
              className={styles.day}
              aria-pressed={day === info.key}
              data-today={now?.day === info.key || undefined}
              onClick={() => setDay(info.key)}
            >
              {language === "en" ? info.en : info.short}
              {now?.day === info.key && <span className="visually-hidden"> ({copy.today})</span>}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.count} aria-live="polite">
        {day === ALL ? copy.count(matches.length) : copy.slotCount(daySlots.length)}
      </p>

      {empty ? (
        <div className={styles.empty}>
          <p>{copy.empty}</p>
          <button
            type="button"
            className={styles.clear}
            onClick={() => {
              setQuery("");
              setDay(ALL);
            }}
          >
            {copy.clear}
          </button>
        </div>
      ) : day === ALL ? (
        <div className={styles.layout}>
          <nav className={styles.index} aria-label={copy.index}>
            {allLetters.map((letter) =>
              letters.has(letter) ? (
                <a key={letter} href={`#konzultacije-${letter}`} className={styles.letterLink}>
                  {letter}
                </a>
              ) : (
                <span key={letter} className={styles.letterOff} aria-hidden="true">
                  {letter}
                </span>
              ),
            )}
          </nav>
          <div className={styles.list}>
            <div className={`${styles.cols} ${styles.head}`} aria-hidden="true">
              <span>{copy.lecturer}</span>
              <span>{copy.room}</span>
              <span className={styles.headSlots}>
                <span>{copy.slot(1)}</span>
                <span>{copy.slot(2)}</span>
              </span>
              <span />
            </div>
            {[...(mine.length ? [{ letter: copy.mine, key: "mine", entries: mine }] : []), ...groups].map((group) => (
              <div key={group.key ?? group.letter} className={styles.group}>
                <h2 id={group.key ? undefined : `konzultacije-${group.letter}`} className={styles.letter}>
                  {group.letter}
                </h2>
                <ul className={styles.panel} role="list">
                  {group.entries.map((entry) => (
                    <li key={entry.id} className={`${styles.row} ${styles.cols}`}>
                      <span className={styles.who}>
                        <Star name={entry.name} on={starred.has(entry.name)} copy={copy} />
                        <span className={styles.name}>{entry.name}</span>
                        <span className={styles.roomInline}>{entry.room}</span>
                      </span>
                      <span className={styles.room}>{entry.room}</span>
                      {entry.slots.length > 0 ? (
                        <span className={styles.slots}>
                          {entry.slots.map((item, index) => (
                            <span key={index} className={styles.slot}>
                              <DayChip day={item.day} language={language} />
                              <span className={styles.time}>
                                {item.from}–{item.to}
                              </span>
                            </span>
                          ))}
                        </span>
                      ) : (
                        <Agreement entry={entry} copy={copy} />
                      )}
                      <TimetableLink entry={entry} copy={copy} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        parts.map((part) => (
          <div key={part.key} className={styles.group}>
            <div className={styles.partHead}>
              <h2 className={styles.letter}>{part.label}</h2>
              <span className={styles.muted}>{part.range}</span>
            </div>
            <ul className={styles.panel} role="list">
              {part.items.map((item) => {
                const live = isToday && now.time >= item.from && now.time < item.to;
                return (
                  <li key={`${item.entry.id}-${item.from}`} className={`${styles.row} ${styles.dayCols}`} data-live={live || undefined}>
                    <span className={styles.when}>
                      <span className={styles.from}>{item.from}</span>
                      <span className={styles.to}>– {item.to}</span>
                    </span>
                    <span className={styles.who}>
                      <Star name={item.entry.name} on={starred.has(item.entry.name)} copy={copy} />
                      <span className={styles.name}>{item.entry.name}</span>
                      {live && <span className={styles.live}>{copy.live}</span>}
                      <span className={styles.roomInline}>{item.entry.room}</span>
                    </span>
                    <span className={styles.room}>{item.entry.room}</span>
                    <TimetableLink entry={item.entry} copy={copy} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
