"use client";

import { useRef } from "react";
import { useGsap } from "./useGsap";
import { EASE } from "./gsap";

/**
 * Split-text reveal (STYLEGUIDE §8): split → animate → revert().
 * - mode="lines": masked lines, yPercent 105 → 0, 1.2s, stagger .1
 * - mode="chars": yPercent 110 + rotate 8°, 1.3s, stagger .022 (hero,
 *   footer wordmark)
 * Runs once when the element reaches `start` (default top 88%). The text is
 * server-rendered as-is, so it's readable without JS and under reduced
 * motion, where nothing runs.
 */
export default function SplitReveal({
  as: Tag = "div",
  mode = "lines",
  start = "top 88%",
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);

  useGsap(({ gsap, SplitText }) => {
    const el = ref.current;
    if (!el) return;
    const chars = mode === "chars";
    const split = SplitText.create(el, {
      // Chars sit inside word wrappers so a line can only break between
      // words — bare chars let the browser break mid-word while split.
      type: chars ? "lines,words,chars" : "lines",
      mask: "lines",
      linesClass: "split-line",
      charsClass: "split-char",
    });
    gsap.from(chars ? split.chars : split.lines, {
      yPercent: chars ? 110 : 105,
      rotate: chars ? 8 : 0,
      duration: chars ? 1.3 : 1.2,
      ease: EASE.out,
      stagger: chars ? 0.022 : 0.1,
      scrollTrigger: { trigger: el, start, once: true },
      onComplete: () => split.revert(),
    });
    return () => split.revert();
  });

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
