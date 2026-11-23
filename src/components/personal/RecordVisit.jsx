"use client";

import { useEffect } from "react";
import { rememberVisit } from "@/lib/personal";

// Adds the page to "Nedavno posjećeno" (only with the visitor's consent).
export default function RecordVisit({ uri, title }) {
  useEffect(() => {
    rememberVisit({ uri, title });
  }, [uri, title]);
  return null;
}
