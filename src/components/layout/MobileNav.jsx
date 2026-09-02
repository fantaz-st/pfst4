"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { getChromeCopy } from "@/lib/chromeCopy";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./MobileNav.module.css";

export default function MobileNav({ menu, language = "hr", translations }) {
  const [open, setOpen] = useState(false);
  const [levels, setLevels] = useState([]);
  const copy = getChromeCopy(language);
  const panelId = useId();
  const toggleRef = useRef(null);
  const firstLinkRef = useRef(null);
  const currentItems = levels.length
    ? levels[levels.length - 1].children
    : menu;
  const currentTitle = levels.length
    ? levels[levels.length - 1].label
    : copy.siteName;

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setLevels([]);
    toggleRef.current?.focus();
  }

  function openLevel(item) {
    setLevels((current) => [
      ...current,
      { label: item.label, children: item.children },
    ]);
  }

  return (
    <div className={styles.mobileNav}>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={copy.menuLabel}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span
          className={styles.menuIcon}
          data-open={open ? "true" : "false"}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </span>
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        <LanguageSwitcher
          currentLanguage={language}
          translations={translations}
          className="mobileDropdown"
        />
        <div className={styles.panelHeader}>
          {levels.length > 0 && (
            <button
              type="button"
              className={styles.back}
              onClick={() => setLevels((current) => current.slice(0, -1))}
            >
              <span className={styles.backArrow} aria-hidden="true" />
              {copy.backMenu}
            </button>
          )}
          <p className={styles.title}>{currentTitle}</p>
        </div>
        <ul className={styles.list}>
          {currentItems.map((item, index) => (
            <li key={item.databaseId}>
              {item.children.length > 0 ? (
                <button
                  ref={index === 0 ? firstLinkRef : undefined}
                  type="button"
                  onClick={() => openLevel(item)}
                >
                  {item.label}
                  <span className={styles.arrow} aria-hidden="true" />
                </button>
              ) : (
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.uri}
                  onClick={close}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
