"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { getChromeCopy } from "@/lib/chromeCopy";
import styles from "./MobileNav.module.css";

export default function MobileNav({ menu, language = "hr" }) {
  const [open, setOpen] = useState(false);
  const copy = getChromeCopy(language);
  const panelId = useId();
  const toggleRef = useRef(null);
  const firstLinkRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={styles.mobileNav}>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? copy.closeMenu : copy.openMenu}
      </button>

      <div id={panelId} className={styles.panel} hidden={!open}>
        <ul className={styles.list}>
          {menu.map((item, index) => (
            <li key={item.databaseId}>
              <Link
                href={item.uri}
                ref={index === 0 ? firstLinkRef : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
              {item.children.length > 0 && (
                <ul className={styles.sublist}>
                  {item.children.map((child) => (
                    <li key={child.databaseId}>
                      <Link href={child.uri} onClick={() => setOpen(false)}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
