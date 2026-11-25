"use client";

import { KEYS, useStored } from "@/lib/personal";

// "Tvoj raspored: Pomorska nautika · 1. godina" on the homepage timetable
// tile, once the visitor has picked a timetable.
export default function MyTimetableNote({ className, prefix }) {
  const saved = useStored(KEYS.timetable, null);
  if (!saved?.label) return null;
  return (
    <span className={className}>
      {prefix} {saved.label}
    </span>
  );
}
