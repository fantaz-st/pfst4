import { TEACHING_TYPES, formatDay } from "@/lib/timetable";
import styles from "./TimetableWeek.module.css";

const TYPE_CLASS = { P: styles.typeP, A: styles.typeA, L: styles.typeL };

// Like Sceduly: each day is a column of cards in time order, each card as
// tall as its text — no time axis, so nothing is squeezed or cut. ≤900px
// the columns stack into one list.
export default function TimetableWeek({ days, today, show }) {
  return (
    <div className={styles.week} style={{ "--days": days.length }}>
      {days.map((day) => (
        <section key={day.date} className={styles.day}>
          <h2 className={`${styles.dayHead} ${day.date === today ? styles.today : ""}`}>
            <span className={styles.dayShort}>{day.short}</span>
            <span className={styles.dayName}>{day.name}</span>
            <span className="num">{formatDay(day.date)}</span>
          </h2>

          {day.holiday ? (
            <p className={styles.dayNote}>{day.holiday}</p>
          ) : day.events.length ? (
            day.events.map((event) => (
              <article key={event.id} className={`${styles.event} ${TYPE_CLASS[event.type] ?? ""}`}>
                <span className={`${styles.time} num`}>
                  {event.start}–{event.end}
                  {show.room && event.room && <span className={styles.room}>{event.room}</span>}
                </span>
                <span className={styles.subject}>{event.subject}</span>
                <span className={styles.meta}>
                  {[TEACHING_TYPES[event.type] ?? event.type, event.group && `Grupa ${event.group}`].filter(Boolean).join(" · ")}
                </span>
                {show.lecturer && event.lecturers.length > 0 && <span className={styles.meta}>{event.lecturers.join(", ")}</span>}
                {show.program && event.programLabel && <span className={styles.meta}>{event.programLabel}</span>}
              </article>
            ))
          ) : (
            <p className={styles.dayNote}>Nema nastave</p>
          )}
        </section>
      ))}
    </div>
  );
}
