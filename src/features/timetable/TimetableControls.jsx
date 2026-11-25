"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import styles from "./TimetableControls.module.css";

const MODES = [
  { key: "studij", label: "Studij", placeholder: "Odaberite studij" },
  { key: "nastavnik", label: "Nastavnik", placeholder: "Odaberite nastavnika" },
  { key: "dvorana", label: "Dvorana", placeholder: "Odaberite dvoranu" },
];

// Mode tabs + one select. Choosing an option navigates (?studij=…), so the
// server renders the week — the URL is shareable and works without JS state.
export default function TimetableControls({ programs, lecturers, rooms, selection, week, basePath }) {
  const router = useRouter();
  const initial = selection.lecturer ? "nastavnik" : selection.room ? "dvorana" : "studij";
  const [mode, setMode] = useState(initial);
  const value = { studij: selection.program, nastavnik: selection.lecturer, dvorana: selection.room }[mode] ?? "";
  const current = MODES.find((item) => item.key === mode);

  const selectedProgram = mode === "studij" ? programs.find((program) => program.id === selection.program) : null;

  const navigate = (params) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, item]) => item));
    query.set("tjedan", week);
    router.push(`${basePath}?${query}`, { scroll: false });
  };
  const choose = (next) => navigate({ [mode]: next });

  return (
    <div className={styles.controls}>
      <div className={styles.tabs} role="tablist" aria-label="Prikaz rasporeda">
        {MODES.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={mode === item.key}
            className={styles.tab}
            onClick={() => setMode(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <label className={styles.select}>
        <select aria-label={current.placeholder} value={value} onChange={(event) => choose(event.target.value)}>
          <option value="">{current.placeholder}</option>
          {mode === "studij" && (
            <>
              <optgroup label="Prijediplomski studiji">
                {programs.filter((program) => !program.graduate).map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Diplomski studiji">
                {programs.filter((program) => program.graduate).map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </optgroup>
            </>
          )}
          {mode === "nastavnik" &&
            lecturers.map((lecturer) => (
              <option key={lecturer.id} value={lecturer.id}>
                {lecturer.name}
              </option>
            ))}
          {mode === "dvorana" &&
            rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
        </select>
        <Icon name="chevronDown" size={18} className={styles.chevron} />
      </label>
      {selectedProgram?.yearCount > 0 && (
        <label className={`${styles.select} ${styles.yearSelect}`}>
          <select
            aria-label="Godina studija"
            value={selection.year ?? "sve"}
            onChange={(event) => navigate({ studij: selectedProgram.id, godina: event.target.value })}
          >
            <option value="sve">Sve godine</option>
            {Array.from({ length: selectedProgram.yearCount }, (_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}. godina
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={18} className={styles.chevron} />
        </label>
      )}
    </div>
  );
}
