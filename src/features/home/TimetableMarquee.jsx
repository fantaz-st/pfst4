import { TEACHING_TYPES } from "@/lib/timetable";
import styles from "./TimetableMarquee.module.css";

const COLUMNS = 5;
// Copies of each column's cards. The loop moves by one copy; four keep the
// tilted column longer than the tile at every point of the loop, so its end
// never comes into view.
const COPIES = 4;
const TYPE_CLASS = { P: styles.typeP, A: styles.typeA, L: styles.typeL };

// Background of the "Raspored nastave" tile: a tilted wall of timetable
// cards (same look as /nastava/studiranje/raspored), sample data from
// timetableSample.js. Each column holds its cards COPIES times; PageMotion
// loops it by one copy (alternate columns reversed) and speeds it in on
// reveal (data-timetable-wall / data-wall-column). Decorative, so
// aria-hidden.
export default function TimetableMarquee({ entries }) {
  const columns = Array.from({ length: COLUMNS }, (_, column) =>
    entries.map((entry, index) => ({ ...entry, key: index })).filter((entry) => entry.key % COLUMNS === column),
  );

  return (
    <span className={styles.marquee} aria-hidden="true">
      <span className={styles.wall} data-timetable-wall data-copies={COPIES}>
        {columns.map((cards, columnIndex) => (
          <span
            key={columnIndex}
            className={styles.column}
            data-wall-column
            data-duration={50 + columnIndex * 7}
            data-reverse={columnIndex % 2 === 1}
          >
            {Array.from({ length: COPIES }, (_, copy) => (
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
