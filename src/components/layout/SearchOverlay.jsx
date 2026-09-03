"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./SearchOverlay.module.css";

export default function SearchOverlay({ language = "hr" }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const closeRef = useRef(null);
  const action = language === "en" ? "/en/search" : "/pretraga";
  const copy =
    language === "en"
      ? {
          label: "Search",
          close: "Close search",
          placeholder: "Search pages and posts",
        }
      : {
          label: "Pretraži",
          close: "Zatvori pretragu",
          placeholder: "Pretraži stranice i objave",
        };

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        closeRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.search}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={copy.label}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <img
          src="/magnifier.svg"
          className={styles.magnifier}
          alt=""
          aria-hidden="true"
        />
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-label={copy.label}
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              aria-label={copy.close}
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true" />
            </button>
            <form className={styles.form} action={action}>
              <label htmlFor="site-search" className={styles.label}>
                {copy.label}
              </label>
              <div className={styles.inputWrap}>
                <input
                  ref={inputRef}
                  id="site-search"
                  name="q"
                  type="search"
                  placeholder={copy.placeholder}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className={styles.submit}
                  aria-label={copy.label}
                >
                  <img
                    src="/magnifier.svg"
                    className={styles.magnifier}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              </div>
            </form>
          </div>,
          document.body,
        )}
    </div>
  );
}
