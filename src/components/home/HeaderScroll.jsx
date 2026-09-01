"use client";

import { useEffect, useRef } from "react";
import styles from "./HeaderScroll.module.css";

// Sitewide auto-hiding header (CLAUDE.md § Design intent): hides on scroll
// down, reveals on scroll up. GSAP only ships inside components/home/ per
// project convention, so this wrapper lives here even though SiteChrome
// (components/layout/) uses it on every route. The Header it wraps stays a
// plain Server Component — animation is applied to the wrapper from
// outside, so nothing here blocks static prerendering.
//
// Two nested elements, not one: `position: sticky` and a `transform` on the
// SAME element is a known cross-browser landmine (WebKit in particular can
// leave a sticky element stuck wherever its transform last put it, instead
// of re-tracking scroll) — exactly the "hides down, never returns" symptom.
// The outer div owns the sticky positioning and is never transformed; the
// inner div is a plain in-flow element and is the only thing GSAP touches.
export default function HeaderScroll({ children }) {
  const slideRef = useRef(null);

  useEffect(() => {
    const slide = slideRef.current;
    if (!slide) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let removeListener = () => {};

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;

      let lastY = window.scrollY;
      let hidden = false;

      function onScroll() {
        const y = window.scrollY;
        const scrollingDown = y > lastY;
        const pastHeader = y > slide.offsetHeight;

        if (scrollingDown && pastHeader && !hidden) {
          hidden = true;
          gsap.to(slide, { yPercent: -100, duration: 0.3, ease: "power2.out" });
        } else if ((!scrollingDown || !pastHeader) && hidden) {
          hidden = false;
          gsap.to(slide, { yPercent: 0, duration: 0.3, ease: "power2.out" });
        }
        lastY = y;
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      removeListener = () => window.removeEventListener("scroll", onScroll);
    });

    return () => {
      cancelled = true;
      removeListener();
    };
  }, []);

  return (
    <div className={styles.sticky}>
      <div ref={slideRef} className={styles.slide}>
        {children}
      </div>
    </div>
  );
}
