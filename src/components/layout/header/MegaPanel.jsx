"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useGsap } from "@/components/motion/useGsap";
import { EASE } from "@/components/motion/gsap";
import { getChromeCopy } from "@/lib/chromeCopy";
import { toColumns } from "./navUtils";
import styles from "./MegaPanel.module.css";

/**
 * Desktop mega panel for one top-level menu item (design/mega-menu.html):
 * section intro + overview link on the left, the item's groups in four
 * columns, search + "Često traženo" + close along the bottom, signal-flag
 * band at the edge. Focus moves into the panel on open; Escape closes.
 */
export default function MegaPanel({ item, language, frequent, onClose, floating = false }) {
  const copy = getChromeCopy(language);
  const ref = useRef(null);
  const columns = toColumns(item.children);

  // The parent passes a new onClose each render; keep the latest in a ref so
  // this effect runs once per open (focus must not jump back on re-render).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    function onKey(event) {
      if (event.key === "Escape") onCloseRef.current();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Reveal: clip-path wipe down, then the items stagger in (menu.js).
  useGsap(
    ({ gsap }) => {
      gsap.fromTo(
        ref.current,
        { clipPath: "inset(0% 0% 100% 0% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          duration: 0.8,
          ease: EASE.out,
          clearProps: "clipPath",
        },
      );
      gsap.from(ref.current.querySelectorAll("[data-mm-item]"), {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: EASE.out,
        stagger: 0.035,
        delay: 0.12,
        clearProps: "transform,opacity",
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      id={`mega-${item.databaseId}`}
      className={`${styles.panel} ${floating ? styles.floating : ""}`}
      role="region"
      aria-label={copy.megaMenuLabel(item.label)}
      tabIndex={-1}
    >
      <div className={styles.body}>
        <div className={styles.intro} data-mm-item>
          <span className={styles.label}>
            <span className={styles.dot} aria-hidden="true" />
            {item.label}
          </span>
          <p className={styles.title}>{item.label}</p>
          <Link href={item.uri} className={styles.overview}>
            {copy.sectionOverview(item.label)}
            <Icon name="arrow" size={16} />
          </Link>
        </div>

        <div className={styles.columns}>
          {columns.map((groups, index) => (
            <div key={index} className={styles.column}>
              {groups.map((group) => (
                <div key={group.databaseId} data-mm-item>
                  <Link href={group.uri} className={styles.groupHeading}>
                    {group.label}
                    <span className={styles.groupArrow} aria-hidden="true">
                      <Icon name="arrow" size={14} />
                    </span>
                  </Link>
                  {group.children.length > 0 && (
                    <ul className={styles.links} role="list">
                      {group.children.map((link) => (
                        <li key={link.databaseId}>
                          <Link href={link.uri} className={styles.link}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer} data-mm-item>
        <form
          className={styles.search}
          action={language === "en" ? "/en/search" : "/pretraga"}
          role="search"
        >
          <Icon name="search" size={18} />
          <input
            type="search"
            name="q"
            placeholder={copy.searchPlaceholder}
            aria-label={copy.searchPlaceholder}
          />
        </form>
        <div className={styles.quick}>
          <span className={styles.quickLabel}>{copy.frequent}</span>
          {frequent.map((link) => (
            <Link key={link.href} href={link.href} className={styles.chip}>
              {link.label}
            </Link>
          ))}
          <button type="button" className={styles.close} onClick={() => onClose()}>
            {copy.close}
            <Icon name="close" size={14} />
          </button>
        </div>
      </div>
      <div className={styles.flags} aria-hidden="true" />
    </div>
  );
}
