"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

// Monday = 0 … Friday = 4 in Zagreb, null at the weekend.
function zagrebWeekday() {
  const day = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Zagreb", weekday: "short" }).format(new Date());
  const index = ["Mon", "Tue", "Wed", "Thu", "Fri"].indexOf(day);
  return index === -1 ? null : index;
}

const plural = (count) => (count % 10 === 1 && count % 100 !== 11 ? "termin" : "termina");

/**
 * "Danas 24 termina" — today's consultation slots, worked out in the
 * browser so a cached homepage never shows yesterday's number. At the
 * weekend: the week's total.
 */
export default function ConsultationsToday({ counts, className }) {
  // -1 during hydration (server and first client render agree), then the weekday.
  const day = useSyncExternalStore(noop, zagrebWeekday, () => -1);
  if (!counts || day === -1) return null;

  if (day === null) {
    const total = counts.reduce((sum, count) => sum + count, 0);
    return <span className={className}>{`${total} ${plural(total)} tjedno`}</span>;
  }
  const today = counts[day];
  return <span className={className} data-live>{today ? `Danas ${today} ${plural(today)}` : "Danas nema termina"}</span>;
}
