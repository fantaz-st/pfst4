"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/layout/Brand";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import {
  gsap,
  ScrollTrigger,
  MOTION_OK,
  MEDIA,
  EASE,
} from "@/components/motion/gsap";
import { getChromeCopy } from "@/lib/chromeCopy";
import { localizedHomeUri } from "@/lib/language";
import { ENROLL_URL } from "@/lib/siteLinks";
import { NAV_BEHAVIOUR, NAV_REVEAL_TOLERANCE } from "@/lib/navSettings";
import { isCurrentSection } from "./navUtils";
import MegaPanel from "./MegaPanel";
import styles from "./FloatingNav.module.css";

/**
 * Floating dark pill nav (STYLEGUIDE §6/§8). When it shows is set per
 * desktop / mobile in lib/navSettings.js:
 * - "pinned": slides in once the bottom of the page's Hero passes 90px from
 *   the top and leaves when scrolling back up to it.
 * - "reveal": hides on scroll down, slides in on any scroll up once the
 *   header bar over the hero is out of view.
 * In: 0.8s expo.out, out: 0.5s power3.in. Showing/hiding is navigation, not
 * decoration, so it also works under reduced motion — just without the
 * slide. While hidden it is `inert`, so it's never tabbable off-screen.
 *
 * Below 1080px it splits into two pills: the modra brand pill (sign + PFST +
 * faculty name) and a white actions pill with search and the plava menu
 * button. While the search layer is open the menu button's three dots turn
 * into an X that closes it.
 */
export default function FloatingNav({
  menu,
  language,
  frequent,
  openItem,
  onToggleMega,
  onCloseMega,
  onTriggerRef,
  onBeforeShow,
  onBeforeHide,
  onOpenMenu,
  menuOpen,
  onOpenSearch,
  onCloseSearch,
  searchOpen,
}) {
  const copy = getChromeCopy(language);
  const pathname = usePathname();
  const ref = useRef(null);
  const onBeforeShowRef = useRef(onBeforeShow);
  const onBeforeHideRef = useRef(onBeforeHide);
  const wasVisible = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    onBeforeShowRef.current = onBeforeShow;
    onBeforeHideRef.current = onBeforeHide;
  }, [onBeforeHide, onBeforeShow]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const animate = () => window.matchMedia(MOTION_OK).matches;
    const behaviour = () =>
      window.matchMedia(MEDIA.aboveTablet).matches
        ? NAV_BEHAVIOUR.desktop
        : NAV_BEHAVIOUR.mobile;

    function show(on, { instant = false } = {}) {
      if (on === wasVisible.current && !instant) return;
      if (on && !wasVisible.current) onBeforeShowRef.current?.();
      if (!on && wasVisible.current) onBeforeHideRef.current?.();
      wasVisible.current = on;
      setVisible(on);
      gsap.to(el, {
        // The CSS fallback translateY(-200%) is read by GSAP as a px `y`;
        // zero it so only yPercent positions the nav.
        y: 0,
        yPercent: on ? 0 : -200,
        duration: instant || !animate() ? 0 : on ? 0.8 : 0.5,
        ease: on ? EASE.out : "power3.in",
        overwrite: true,
      });
    }

    let pastHero = false; // "pinned" zone
    let pastBar = false; // "reveal" zone
    let scrollingUp = false;
    let anchor = 0; // scroll position of the last direction change

    function update(options) {
      show(
        behaviour() === "reveal" ? pastBar && scrollingUp : pastHero,
        options,
      );
    }

    const hero = document.querySelector("[data-hero]");
    const bar = document.querySelector("[data-hero-nav]");
    const heroTrigger = ScrollTrigger.create({
      // Without a hero, show it once the header has scrolled away.
      trigger: hero ?? document.body,
      start: hero ? "bottom 90" : "top -200",
      // Only crossing the start matters; an `end` would hide the nav again
      // at the bottom of short pages.
      onEnter: () => {
        pastHero = true;
        update();
      },
      onLeaveBack: () => {
        pastHero = false;
        update();
      },
    });
    const barTrigger = ScrollTrigger.create({
      trigger: bar ?? document.body,
      start: bar ? "bottom top" : "top -200",
      onEnter: () => {
        pastBar = true;
        update();
      },
      onLeaveBack: () => {
        pastBar = false;
        scrollingUp = false;
        update();
      },
    });
    const directionTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        if (Math.abs(y - anchor) < NAV_REVEAL_TOLERANCE) return;
        scrollingUp = y < anchor;
        anchor = y;
        update();
      },
    });

    // Sync with the page we landed on (e.g. after navigation or a reload
    // mid-page), without animating. Mid-page in "reveal" it starts shown;
    // the first scroll down hides it.
    const frame = requestAnimationFrame(() => {
      pastHero = heroTrigger.scroll() >= heroTrigger.start;
      pastBar = barTrigger.scroll() >= barTrigger.start;
      scrollingUp = pastBar;
      anchor = directionTrigger.scroll();
      update({ instant: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      heroTrigger.kill();
      barTrigger.kill();
      directionTrigger.kill();
    };
    // Each page has its own hero: re-measure after navigation.
  }, [pathname]);

  return (
    <div
      ref={ref}
      className={styles.wrap}
      data-float-nav
      inert={!visible || menuOpen}
    >
      <nav className={styles.inner} aria-label={copy.mainNavLabel}>
        <Link
          href={localizedHomeUri(language)}
          className={styles.logo}
          aria-label={copy.siteNameHome}
        >
          <BrandMark className={styles.mark} />
          <span className={styles.wordmark} aria-hidden="true">
            {copy.brandShort}
          </span>
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.tagline} aria-hidden="true">
            {copy.brandTagline[0]}
            <br />
            {copy.brandTagline[1]}
          </span>
        </Link>
        <span className={styles.links}>
          {menu.map((item) => {
            const current = isCurrentSection(item, pathname);
            const hasPanel = item.children.length > 0;
            const open = openItem?.databaseId === item.databaseId;
            const className = `${styles.link} ${current || open ? styles.on : ""}`;

            return hasPanel ? (
              <button
                key={item.databaseId}
                ref={(el) => {
                  onTriggerRef(item.databaseId, el);
                }}
                type="button"
                className={className}
                aria-expanded={open}
                aria-controls={`mega-${item.databaseId}`}
                aria-current={current ? "true" : undefined}
                onClick={() => onToggleMega(item.databaseId)}
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
        </span>
        {/* <Button href={ENROLL_URL} variant="accent" size="s" className={styles.enroll}>
          {copy.enroll}
        </Button> */}
        <span className={styles.actions}>
          <button
            type="button"
            className={styles.searchButton}
            aria-label={searchOpen ? copy.closeSearch : copy.search}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            onClick={searchOpen ? onCloseSearch : onOpenSearch}
          >
            <Icon name="search" size={20} />
          </button>
          <button
            type="button"
            className={styles.menuButton}
            data-close={searchOpen}
            aria-label={searchOpen ? copy.closeSearch : copy.menu}
            aria-expanded={searchOpen ? undefined : menuOpen}
            aria-controls={searchOpen ? "site-search" : "site-menu"}
            onClick={searchOpen ? onCloseSearch : onOpenMenu}
          >
            <span className={styles.dots} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </span>
      </nav>
      {openItem && (
        <MegaPanel
          key={openItem.databaseId}
          item={openItem}
          language={language}
          frequent={frequent}
          floating
          onClose={onCloseMega}
        />
      )}
    </div>
  );
}
