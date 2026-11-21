"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "@/components/layout/Brand";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { gsap, MOTION_OK, EASE } from "@/components/motion/gsap";
import { getLenis } from "@/components/motion/lenisStore";
import { getChromeCopy } from "@/lib/chromeCopy";
// import { ENROLL_URL } from "@/lib/siteLinks";
import { isCurrentPage, isCurrentSection } from "./navUtils";
import styles from "./MobileMenu.module.css";

/**
 * The menu sheet (design/mobile-menu.html): the whole WordPress menu as a
 * two-level accordion (one open item per level), search, "Upiši se", the
 * utility links and HR / EN. Opened by the menu button in the hero nav or
 * the floating nav; full screen on phones, a 430px sheet from the right on
 * wider screens.
 *
 * A modal dialog: focus moves in and is trapped, Escape closes, focus
 * returns to the button that opened it, page scroll pauses.
 */
export default function MobileMenu({
  open,
  onClose,
  menu,
  language,
  languages,
  utility,
}) {
  const copy = getChromeCopy(language);
  const pathname = usePathname();
  const sheetRef = useRef(null);
  const closeRef = useRef(null);

  // Start with the current page's section and group expanded.
  const currentTop = menu.find((item) => isCurrentSection(item, pathname));
  const currentGroup = currentTop?.children.find((group) =>
    isCurrentSection(group, pathname),
  );
  const [openTop, setOpenTop] = useState(currentTop?.databaseId ?? null);
  const [openGroup, setOpenGroup] = useState(currentGroup?.databaseId ?? null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const sheet = sheetRef.current;
    const lenis = getLenis();
    lenis?.stop();
    closeRef.current?.focus();

    function onKey(event) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !sheet) return;
      const focusable = Array.from(
        sheet.querySelectorAll("a[href], button:not([disabled]), input"),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [open]);

  function reveal(id) {
    if (!window.matchMedia(MOTION_OK).matches) return;
    requestAnimationFrame(() => {
      const panel = document.getElementById(id);
      if (!panel) return;
      gsap.from(panel.children, {
        y: 10,
        opacity: 0,
        duration: 0.5,
        ease: EASE.out,
        stagger: 0.03,
        clearProps: "transform,opacity",
      });
    });
  }

  function toggleTop(id) {
    const next = openTop === id ? null : id;
    setOpenTop(next);
    setOpenGroup(null);
    if (next != null) reveal(`m-${id}`);
  }

  function toggleGroup(id) {
    const next = openGroup === id ? null : id;
    setOpenGroup(next);
    if (next != null) reveal(`m-${id}`);
  }

  if (!open) return null;

  return (
    <div className={styles.layer}>
      <button
        type="button"
        className={styles.backdrop}
        tabIndex={-1}
        aria-label={copy.closeMenu}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        id="site-menu"
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={copy.menu}
        data-lenis-prevent
      >
        <div className={styles.top}>
          <Brand language={language} size="s" />
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label={copy.closeMenu}
            onClick={onClose}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <form
          className={styles.search}
          action={language === "en" ? "/en/search" : "/pretraga"}
          role="search"
        >
          <Icon name="search" size={18} />
          <input
            type="search"
            name="q"
            placeholder={copy.searchShort}
            aria-label={copy.searchShort}
          />
        </form>

        <nav className={styles.nav} aria-label={copy.mainNavLabel}>
          {menu.map((item) => {
            const topOpen = openTop === item.databaseId;
            if (item.children.length === 0) {
              return (
                <Link
                  key={item.databaseId}
                  href={item.uri}
                  className={styles.m1}
                  aria-current={
                    isCurrentPage(item, pathname) ? "page" : undefined
                  }
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div key={item.databaseId}>
                <button
                  type="button"
                  className={styles.m1}
                  aria-expanded={topOpen}
                  aria-controls={`m-${item.databaseId}`}
                  onClick={() => toggleTop(item.databaseId)}
                >
                  {item.label}
                  <span className={styles.chevron} aria-hidden="true">
                    <Icon name="chevronDown" size={16} />
                  </span>
                </button>
                <div
                  id={`m-${item.databaseId}`}
                  className={styles.level2}
                  hidden={!topOpen}
                >
                  {item.children.map((group) => {
                    const groupOpen = openGroup === group.databaseId;
                    if (group.children.length === 0) {
                      return (
                        <Link
                          key={group.databaseId}
                          href={group.uri}
                          className={styles.m2}
                          aria-current={
                            isCurrentPage(group, pathname) ? "page" : undefined
                          }
                        >
                          {group.label}
                        </Link>
                      );
                    }
                    return (
                      <div key={group.databaseId}>
                        <button
                          type="button"
                          className={styles.m2}
                          aria-expanded={groupOpen}
                          aria-controls={`m-${group.databaseId}`}
                          onClick={() => toggleGroup(group.databaseId)}
                        >
                          {group.label}
                          <span className={styles.chevron} aria-hidden="true">
                            <Icon name="chevronDown" size={14} />
                          </span>
                        </button>
                        <div
                          id={`m-${group.databaseId}`}
                          className={styles.level3}
                          hidden={!groupOpen}
                        >
                          <Link
                            href={group.uri}
                            className={`${styles.m3} ${styles.overview}`}
                          >
                            {copy.groupOverview(group.label)}
                          </Link>
                          {group.children.map((link) => (
                            <Link
                              key={link.databaseId}
                              href={link.uri}
                              className={styles.m3}
                              aria-current={
                                isCurrentPage(link, pathname)
                                  ? "page"
                                  : undefined
                              }
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className={styles.bottom}>
          {/* <Button href={ENROLL_URL} variant="accent" className={styles.enroll}>
            {copy.enroll}
          </Button> */}
          <div className={styles.utility}>
            <span className={styles.utilityLinks}>
              {utility.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </span>
            <span
              className={styles.languages}
              role="group"
              aria-label={copy.languageLabel}
            >
              {languages.map((item, index) => (
                <span key={item.code}>
                  {index > 0 && <span aria-hidden="true"> / </span>}
                  {item.current ? (
                    <span
                      className={styles.currentLanguage}
                      aria-current="true"
                    >
                      {item.code.toUpperCase()}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      hrefLang={item.code}
                      lang={item.code}
                      aria-label={item.label}
                    >
                      {item.code.toUpperCase()}
                    </Link>
                  )}
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className={styles.flags} aria-hidden="true" />
      </div>
    </div>
  );
}
