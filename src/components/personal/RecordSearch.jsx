"use client";

import { useEffect } from "react";
import { rememberSearch } from "@/lib/personal";

// Adds a search made on the results page to "Nedavne pretrage".
export default function RecordSearch({ term }) {
  useEffect(() => {
    rememberSearch(term);
  }, [term]);
  return null;
}
