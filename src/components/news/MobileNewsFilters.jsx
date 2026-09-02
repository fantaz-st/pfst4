"use client";

import { useEffect, useState } from "react";
import styles from "./MobileNewsFilters.module.css";

export default function MobileNewsFilters({ children, language = "hr" }) {
  const [open, setOpen] = useState(false);
  const label = language === "en" ? "Filters" : "Filteri";

  useEffect(() => {
    if (!open) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls="news-filter-drawer"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      {open && (
        <div className={styles.drawerLayer}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label={language === "en" ? "Close filters" : "Zatvori filtre"}
            onClick={() => setOpen(false)}
          />
          <div
            id="news-filter-drawer"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label={label}
          >
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
            >
              {language === "en" ? "Close" : "Zatvori"}
            </button>
            {children}
          </div>
        </div>
      )}
      <div className={styles.desktopFilters}>{children}</div>
    </div>
  );
}
