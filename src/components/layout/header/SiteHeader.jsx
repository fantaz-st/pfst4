"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "@/components/layout/Brand";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { getChromeCopy } from "@/lib/chromeCopy";
import { ENROLL_URL } from "@/lib/siteLinks";
import { isCurrentSection } from "./navUtils";
import MegaPanel from "./MegaPanel";
import FloatingNav from "./FloatingNav";
import MobileMenu from "./MobileMenu";
import styles from "./SiteHeader.module.css";

/**
 * The header shared by every page (STYLEGUIDE §6, design/reference/home.html,
 * design/mega-menu.html, design/mobile-menu.html):
 * - the main nav bar, laid over the top of the page's Hero (logo, glass
 *   pill nav, white "Upiši se", menu button); items with children open a
 *   mega panel, the current section is a white pill
 * - the floating dark pill nav that slides in once the hero has scrolled by
 * - the menu sheet (accordion of the whole WordPress menu)
 *
 * `menu` is the WordPress menu tree (lib/menu.js); `frequent` and
 * `languages` are plain data prepared on the server.
 */
export default function SiteHeader({ menu, language, frequent, languages, utility }) {
  const copy = getChromeCopy(language);
  const pathname = usePathname();
  const [openId, setOpenId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const triggerRefs = useRef(new Map());
  const lastPathname = useRef(pathname);

  const openItem = menu.find((item) => item.databaseId === openId) ?? null;

  function closeMega({ restoreFocus = true } = {}) {
    if (restoreFocus && openId != null) {
      triggerRefs.current.get(openId)?.focus({ preventScroll: true });
    }
    setOpenId(null);
  }

  // Navigating closes every menu.
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    setOpenId(null);
    setSheetOpen(false);
  }, [pathname]);

  return (
    <>
      <div className={styles.frame}>
        <header className={styles.bar} data-hero-nav>
          <Brand language={language} />

          <nav className={styles.gnav} aria-label={copy.mainNavLabel}>
            {menu.map((item) => {
              const current = isCurrentSection(item, pathname);
              const hasPanel = item.children.length > 0;
              const open = openId === item.databaseId;
              const className = [
                styles.navItem,
                current || open ? styles.on : null,
              ]
                .filter(Boolean)
                .join(" ");

              return hasPanel ? (
                <button
                  key={item.databaseId}
                  ref={(el) => {
                    if (el) triggerRefs.current.set(item.databaseId, el);
                    else triggerRefs.current.delete(item.databaseId);
                  }}
                  type="button"
                  className={className}
                  aria-expanded={open}
                  aria-controls={`mega-${item.databaseId}`}
                  aria-current={current ? "true" : undefined}
                  onClick={() =>
                    open ? closeMega() : setOpenId(item.databaseId)
                  }
                >
                  {item.label}
                  <span className={styles.chevron} aria-hidden="true">
                    <Icon name="chevronDown" size={14} />
                  </span>
                </button>
              ) : (
                <Link
                  key={item.databaseId}
                  href={item.uri}
                  className={className}
                  aria-current={current ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <Button href={ENROLL_URL} variant="white" size="m">
              {copy.enroll}
            </Button>
            <button
              type="button"
              className={styles.menuButton}
              aria-label={copy.menu}
              aria-expanded={sheetOpen}
              aria-controls="site-menu"
              onClick={() => setSheetOpen(true)}
            >
              <Icon name="menu" size={18} />
            </button>
          </div>
        </header>

        {openItem && (
          <MegaPanel
            key={openItem.databaseId}
            item={openItem}
            language={language}
            frequent={frequent}
            onClose={closeMega}
          />
        )}
      </div>

      {openItem && (
        <button
          type="button"
          className={styles.backdrop}
          tabIndex={-1}
          aria-label={copy.closeMenu}
          onClick={() => closeMega()}
        />
      )}

      <FloatingNav
        menu={menu}
        language={language}
        onOpenMenu={() => setSheetOpen(true)}
        menuOpen={sheetOpen}
      />

      <MobileMenu
        key={pathname}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        menu={menu}
        language={language}
        languages={languages}
        utility={utility}
      />
    </>
  );
}
