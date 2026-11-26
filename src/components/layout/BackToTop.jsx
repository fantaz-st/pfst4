"use client";

import { useEffect, useRef, useState } from "react";
import { getLenis } from "@/components/motion/lenisStore";
import { MEDIA, MOTION_OK } from "@/components/motion/gsap";
import styles from "./BackToTop.module.css";

const TOLERANCE = 6; // px of movement before a scroll direction counts (phones)
const RADIUS = 25;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * "Na vrh" (design: "PFST — Na vrh" canvas, A — Prsten): a white circle
 * with an arrow and a plava ring that fills as the page is read. On hover
 * or focus it opens into a navy "Na vrh ↑" pill; at the end of the page it
 * turns plava.
 *
 * Shows once the first screen has scrolled away — on desktop for good, on
 * phones only while scrolling up (like the floating nav), so it never sits
 * over text being read. The ring's dash offset is written straight to the
 * circle on scroll, in px (no re-render per frame).
 */
export default function BackToTop({ label, ariaLabel }) {
  const ref = useRef(null);
  const fillRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const button = ref.current;
    if (!button) return undefined;
    const desktop = window.matchMedia(MEDIA.aboveTablet);
    let anchor = window.scrollY;
    let scrollingUp = false;
    let frame = 0;

    function update() {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (fillRef.current) fillRef.current.style.strokeDashoffset = `${(CIRCUMFERENCE * (1 - progress)).toFixed(2)}px`;
      setAtEnd(progress > 0.98);

      if (Math.abs(y - anchor) >= TOLERANCE) {
        scrollingUp = y < anchor;
        anchor = y;
      }
      const pastFirstScreen = y > window.innerHeight;
      setVisible(pastFirstScreen && (desktop.matches || scrollingUp || progress > 0.98));
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function toTop() {
    const smooth = window.matchMedia(MOTION_OK).matches;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: !smooth });
    else window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    // Keyboard and screen-reader users continue from the top of the content.
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }

  return (
    <button
      ref={ref}
      type="button"
      className={styles.button}
      data-visible={visible || undefined}
      data-end={atEnd || undefined}
      aria-label={ariaLabel}
      aria-hidden={!visible || undefined}
      tabIndex={visible ? 0 : -1}
      onClick={toTop}
    >
      <span className={styles.label} aria-hidden="true">
        {label}
      </span>
      <span className={styles.circle}>
        <svg className={styles.ring} viewBox="0 0 56 56" aria-hidden="true">
          <circle className={styles.track} cx="28" cy="28" r={RADIUS} />
          <circle ref={fillRef} className={styles.fill} cx="28" cy="28" r={RADIUS} style={{ strokeDasharray: `${CIRCUMFERENCE}px`, strokeDashoffset: `${CIRCUMFERENCE}px` }} />
        </svg>
        <svg
          className={styles.arrow}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </span>
    </button>
  );
}
