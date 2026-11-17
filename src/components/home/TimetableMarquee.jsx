import { TEACHING_TYPES } from "@/lib/timetable";
import styles from "./TimetableMarquee.module.css";

const COLUMNS = 5;
const TYPE_CLASS = { P: styles.typeP, A: styles.typeA, L: styles.typeL };

// Background of the "Raspored nastave" tile: a tilted wall of real
// timetable cards (same look as /nastava/studiranje/raspored). Each column
// holds its cards twice and drifts by half its height — alternate columns
// up and down, pure CSS. Decorative, so aria-hidden.
export default function TimetableMarquee({ entries }) {
  const columns = Array.from({ length: COLUMNS }, (_, column) => entries.filter((_, index) => index % COLUMNS === column));

  return (
    <span className={styles.marquee} aria-hidden="true">
      <span className={styles.wall}>
        {columns.map((cards, columnIndex) => (
          <span
            key={columnIndex}
            className={`${styles.column} ${columnIndex % 2 ? styles.reverse : ""}`}
            style={{ "--duration": `${50 + columnIndex * 7}s` }}
          >
            {[0, 1].map((copy) => (
              <span key={copy} className={styles.track}>
                {cards.map((entry) => (
                  <span key={entry.key} className={`${styles.card} ${TYPE_CLASS[entry.type] ?? ""}`}>
                    <span className={styles.top}>
                      <span className="num">
                        {entry.start}–{entry.end}
                      </span>
                      <span className={styles.room}>{entry.room}</span>
                    </span>
                    <span className={styles.subject}>{entry.subject}</span>
                    <span className={styles.meta}>
                      {[TEACHING_TYPES[entry.type] ?? entry.type, entry.group && `Grupa ${entry.group}`].filter(Boolean).join(" · ")}
                    </span>
                    {entry.lecturer && <span className={styles.meta}>{entry.lecturer}</span>}
                  </span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}
