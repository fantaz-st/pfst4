"use client";

import { useRef } from "react";
import styles from "./CompassRose.module.css";
import { useGsap } from "@/components/motion/useGsap";

/**
 * Decorative compass rose that rotates as the page scrolls.
 * From the earlier Upisi CTA design (kept for reuse; not on any page yet).
 *
 * - Scrubbed to scroll: 0° → `degrees` while `trigger` (default: the
 *   compass's parent) travels from entering the viewport to leaving it.
 * - Purely decorative: aria-hidden, pointer-events off.
 * - Off under prefers-reduced-motion (useGsap) — it just sits still.
 *
 * Place it inside a positioned container (position: relative + overflow:
 * hidden) and set position/size from that component's CSS module:
 *
 *   <div className={styles.card}>          // position: relative; overflow: hidden
 *     <CompassRose className={styles.compass} />   // e.g. right: -140px; top: -120px; width: 520px
 *     …
 *   </div>
 *
 * @param {{ tone?: "onDark" | "onLight", degrees?: number, trigger?: string, className?: string }} props
 *   trigger: optional selector; defaults to the parent element.
 */
export default function CompassRose({ tone = "onDark", degrees = 140, trigger, className }) {
  const ref = useRef(null);

  useGsap(
    ({ gsap }) => {
      const el = ref.current;
      if (!el) return;
      const triggerEl = trigger ? document.querySelector(trigger) : el.parentElement;
      gsap.to(el, {
        rotate: degrees,
        ease: "none",
        scrollTrigger: { trigger: triggerEl ?? el, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { deps: [degrees, trigger] },
  );

  return (
    <svg
      ref={ref}
      className={[styles.compass, styles[tone], className].filter(Boolean).join(" ")}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.25"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="16" cy="16" r="14.5" />
      <circle cx="16" cy="16" r="10" />
      <path d="M16 1.5l2.6 14.5L16 30.5l-2.6-14.5z" />
      <path d="M1.5 16l14.5-2.6L30.5 16 16 18.6z" />
      <path d="M5.7 5.7l11 9.2-.6 1.2zM26.3 26.3l-11-9.2.6-1.2zM26.3 5.7l-9.2 11-1.2-.6zM5.7 26.3l9.2-11 1.2.6z" />
    </svg>
  );
}
