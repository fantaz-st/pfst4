"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "@/components/layout/Brand";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { getChromeCopy } from "@/lib/i18n/chromeCopy";
import { ENROLL_URL } from "@/lib/i18n/siteLinks";
import { isCurrentSection } from "./navUtils";
import MegaPanel from "./MegaPanel";
import FloatingNav from "./FloatingNav";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "@/features/search/SearchOverlay";
import { OPEN_SEARCH_EVENT } from "@/features/search/openSiteSearch";
import styles from "./SiteHeader.module.css";

/**
 * The header shared by every page (STYLEGUIDE §6, design/reference/home.html,
 * design/mega-menu.html, design/mobile-menu.html):
 * - the main nav bar, laid over the top of the page's Hero (logo, glass
 *   pill nav, white "Upiši se", menu button); items with children open a
 *   mega panel, the current section is a white pill
 * - the floating dark pill nav that slides in once the hero has scrolled by
 * - the menu sheet (accordion of the whole WordPress menu)
 * - the full-screen search layer, opened by every search control on the
 *   site (floating nav, utility row, menu sheet, mega panel)
 *
 * `menu` is the WordPress menu tree (lib/menu.js); `frequent` and
 * `languages` are plain data prepared on the server.
 */
export default function SiteHeader({ menu, language, frequent, languages, utility }) {
  const copy = getChromeCopy(language);
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const triggerRefs = useRef(new Map());
  const lastPathname = useRef(pathname);

  const openItem = menu.find((item) => item.databaseId === openMenu?.id) ?? null;

  function setTriggerRef(source, id, element) {
    const key = `${source}:${id}`;
    if (element) triggerRefs.current.set(key, element);
    else triggerRefs.current.delete(key);
  }

  function closeMega({ restoreFocus = true } = {}) {
    if (restoreFocus && openMenu) {
      triggerRefs.current.get(`${openMenu.source}:${openMenu.id}`)?.focus({ preventScroll: true });
    }
    setOpenMenu(null);
  }

  function toggleMega(id, source) {
    setOpenMenu((current) => (current?.id === id && current.source === source ? null : { id, source }));
  }

  function openMobileMenu() {
    closeMega({ restoreFocus: false });
    setSearchOpen(false);
    setSheetOpen(true);
  }

  // Focus goes into the search input inside the tap itself (iOS keyboard).
  function openSearch() {
    closeMega({ restoreFocus: false });
    searchRef.current?.prepare();
    setSheetOpen(false);
    setSearchOpen(true);
  }

  // Search controls elsewhere (utility row, menu sheet, mega panel) open
  // the same layer through openSiteSearch().
  const openSearchRef = useRef(openSearch);
  useEffect(() => {
    openSearchRef.current = openSearch;
  });
  useEffect(() => {
    const onOpen = () => openSearchRef.current();
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
  }, []);

  // Navigating closes every menu.
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    setOpenMenu(null);
    setSheetOpen(false);
    setSearchOpen(false);
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
              const open = openMenu?.source === "header" && openMenu.id === item.databaseId;
              const className = [styles.navItem, current || open ? styles.on : null].filter(Boolean).join(" ");

              return hasPanel ? (
                <button
                  key={item.databaseId}
                  ref={(el) => {
                    setTriggerRef("header", item.databaseId, el);
                  }}
                  type="button"
                  className={className}
                  aria-expanded={open}
                  aria-controls={`mega-${item.databaseId}`}
                  aria-current={current ? "true" : undefined}
                  onClick={() => (open ? closeMega() : toggleMega(item.databaseId, "header"))}
                >
                  {item.label}
                  <span className={styles.chevron} aria-hidden="true">
                    <Icon name="chevronDown" size={14} />
                  </span>
                </button>
              ) : (
                <Link key={item.databaseId} href={item.uri} className={className} aria-current={current ? "page" : undefined}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <Button href={ENROLL_URL} variant="white" size="m">
              {copy.enroll}
            </Button>
            <button type="button" className={styles.menuButton} aria-label={copy.menu} aria-expanded={sheetOpen} aria-controls="site-menu" onClick={openMobileMenu}>
              <Icon name="menu" size={18} />
            </button>
          </div>
        </header>

        {openItem && openMenu.source === "header" && <MegaPanel key={openItem.databaseId} item={openItem} language={language} frequent={frequent} onClose={closeMega} />}
      </div>

      {openItem && <button type="button" className={styles.backdrop} tabIndex={-1} aria-label={copy.closeMenu} onClick={() => closeMega()} />}

      <FloatingNav
        menu={menu}
        language={language}
        frequent={frequent}
        openItem={openMenu?.source === "floating" ? openItem : null}
        onToggleMega={(id) => toggleMega(id, "floating")}
        onCloseMega={closeMega}
        onTriggerRef={(id, element) => setTriggerRef("floating", id, element)}
        onBeforeShow={() => {
          if (openMenu?.source === "header") {
            closeMega({ restoreFocus: false });
          }
        }}
        onBeforeHide={() => {
          if (openMenu?.source === "floating") {
            closeMega({ restoreFocus: false });
          }
        }}
        onOpenMenu={openMobileMenu}
        menuOpen={sheetOpen}
        onOpenSearch={openSearch}
        onCloseSearch={() => setSearchOpen(false)}
        searchOpen={searchOpen}
      />

      <SearchOverlay ref={searchRef} open={searchOpen} onClose={() => setSearchOpen(false)} language={language} frequent={frequent} />

      <MobileMenu key={pathname} open={sheetOpen} onClose={() => setSheetOpen(false)} menu={menu} language={language} languages={languages} utility={utility} />
    </>
  );
}
