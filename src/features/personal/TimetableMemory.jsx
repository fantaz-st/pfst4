"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { KEYS, read, rememberTimetable } from "@/lib/personal";

/**
 * "Moj raspored": a selection made in Raspored is remembered; opening
 * Raspored without one (menu, homepage tile) goes straight back to it.
 * `query` is the selection without the week, e.g. "studij=739&godina=1".
 */
export default function TimetableMemory({ query, label, basePath }) {
  const router = useRouter();

  useEffect(() => {
    if (query) {
      rememberTimetable({ query, label });
      return;
    }
    const saved = read(KEYS.timetable, null);
    if (saved?.query) router.replace(`${basePath}?${saved.query}`, { scroll: false });
  }, [query, label, basePath, router]);

  return null;
}
