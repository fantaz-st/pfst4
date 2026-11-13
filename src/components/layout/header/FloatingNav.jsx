"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/layout/Brand";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { gsap, ScrollTrigger, MOTION_OK, EASE } from "@/components/motion/gsap";
import { getChromeCopy } from "@/lib/chromeCopy";
import { localizedHomeUri } from "@/lib/language";
import { ENROLL_URL } from "@/lib/siteLinks";
import { isCurrentSection } from "./navUtils";
import styles from "./FloatingNav.module.css";

/**
 * Floating dark pill nav (STYLEGUIDE §6/§8): slides in once the bottom of
 * the page's Hero passes 90px from the top (0.8s expo.out) and leaves when
 * scrolling back up (0.5s power3.in). Showing/hiding is navigation, not
 * decoration, so it also works under reduced motion — just without the
 * slide. While hidden it is `inert`, so it's never tabbable off-screen.
 */
export default function FloatingNav({ menu, language, onOpenMenu, menuOpen }) {
  const copy = getChromeCopy(language);
  const pathname = usePathname();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const animate = () => window.matchMedia(MOTION_OK).matches;

    function show(on, { instant = false } = {}) {
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

    const hero = document.querySelector("[data-hero]");
    const trigger = ScrollTrigger.create({
      // Without a hero, show it once the header has scrolled away.
      trigger: hero ?? document.body,
      start: hero ? "bottom 90" : "top -200",
      // Only crossing the start matters; an `end` would hide the nav again
      // at the bottom of short pages.
      onEnter: () => show(true),
      onLeaveBack: () => show(false),
    });
    // Sync with the page we landed on (e.g. after navigation or a reload
    // mid-page), without animating.
    const frame = requestAnimationFrame(() =>
      show(trigger.scroll() >= trigger.start, { instant: true }),
    );
    return () => {
      cancelAnimationFrame(frame);
      trigger.kill();
    };
    // Each page has its own hero: re-measure after navigation.
  }, [pathname]);

  return (
    <div ref={ref} className={styles.wrap} inert={!visible || menuOpen}>
      <nav className={styles.inner} aria-label={copy.mainNavLabel}>
        <Link
          href={localizedHomeUri(language)}
          className={styles.logo}
          aria-label={copy.siteNameHome}
        >
          <BrandMark className={styles.mark} />
        </Link>
        <span className={styles.links}>
          {menu.map((item) => {
            const current = isCurrentSection(item, pathname);
            return (
              <Link
                key={item.databaseId}
                href={item.uri}
                className={`${styles.link} ${current ? styles.on : ""}`}
                aria-current={current ? "true" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </span>
        <Button href={ENROLL_URL} variant="accent" size="s" className={styles.enroll}>
          {copy.enroll}
        </Button>
        <button
          type="button"
          className={styles.menuButton}
          aria-label={copy.menu}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={onOpenMenu}
        >
          <Icon name="menu" size={18} />
        </button>
      </nav>
    </div>
  );
}
