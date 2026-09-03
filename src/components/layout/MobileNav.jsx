"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { getChromeCopy } from "@/lib/chromeCopy";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchOverlay from "./SearchOverlay";
import styles from "./MobileNav.module.css";

function normalizeUri(uri) {
  if (!uri) return "";
  try {
    return (
      new URL(uri, "http://localhost").pathname
        .replace(/\/{2,}/g, "/")
        .replace(/(?<!^)\/$/, "") || "/"
    );
  } catch {
    return uri.replace(/\/{2,}/g, "/").replace(/(?<!^)\/$/, "") || "/";
  }
}

function findMenuPath(items, currentUri, ancestors = []) {
  for (const item of items) {
    if (normalizeUri(item.uri) === currentUri) return [...ancestors, item];
    const path = findMenuPath(item.children, currentUri, [...ancestors, item]);
    if (path) return path;
  }
  return null;
}

function getInitialLevels(menu, currentUri) {
  const path = currentUri ? findMenuPath(menu, normalizeUri(currentUri)) : null;
  return path
    ? path
        .slice(0, -1)
        .map((item) => ({ label: item.label, children: item.children }))
    : [];
}

export default function MobileNav({
  menu,
  language = "hr",
  translations,
  currentUri,
}) {
  const [open, setOpen] = useState(false);
  const initialLevels = getInitialLevels(menu, currentUri);
  const [levels, setLevels] = useState(initialLevels);
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
      if (event.key === "Escape") {
        setOpen(false);
        setLevels(getInitialLevels(menu, currentUri));
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentUri, menu, open]);

  function close() {
    setOpen(false);
    setLevels(initialLevels);
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
        <div className={styles.panelTools}>
          <SearchOverlay language={language} />
          <LanguageSwitcher
            currentLanguage={language}
            translations={translations}
            className="mobileDropdown"
          />
        </div>
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
                <div className={styles.itemRow}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.uri}
                    aria-current={
                      normalizeUri(item.uri) === normalizeUri(currentUri)
                        ? "page"
                        : undefined
                    }
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    className={styles.submenuButton}
                    aria-label={`${copy.openSubmenu}: ${item.label}`}
                    onClick={() => openLevel(item)}
                  >
                    <img
                      src="/chevron.svg"
                      className={styles.arrow}
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                </div>
              ) : (
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.uri}
                  aria-current={
                    normalizeUri(item.uri) === normalizeUri(currentUri)
                      ? "page"
                      : undefined
                  }
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
