"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, MOTION_OK } from "./gsap";

/**
 * Runs a GSAP setup inside gsap.matchMedia(), so:
 * - nothing runs under prefers-reduced-motion (or outside `media`),
 * - everything the setup creates (tweens, ScrollTriggers, SplitText) is
 *   reverted automatically on unmount or when the media query stops
 *   matching,
 * - it starts only after document.fonts.ready, so SplitText measures lines
 *   in Montserrat, not in the fallback face.
 *
 * const ref = useRef(null);
 * useGsap(({ gsap, SplitText }) => {
 *   gsap.from(".title", { yPercent: 105 });   // selectors scoped to ref
 * }, { scope: ref });
 *
 * @param {(api: { gsap, ScrollTrigger, SplitText, context }) => void | (() => void)} setup
 * @param {{ scope?: React.RefObject<Element>, media?: string, deps?: unknown[] }} [options]
 *   media is ANDed with prefers-reduced-motion: no-preference.
 */
export function useGsap(setup, { scope, media, deps = [] } = {}) {
  // Always call the latest setup without re-running the effect on every
  // render. Updated in an effect (refs can't be written during render);
  // effects run in order, so this lands before the setup effect below.
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    let cancelled = false;
    let mm = null;
    const query = media ? `${MOTION_OK} and ${media}` : MOTION_OK;

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      mm = gsap.matchMedia(scope?.current ?? undefined);
      mm.add(query, (context) =>
        setupRef.current({ gsap, ScrollTrigger, SplitText, context }),
      );
    });

    return () => {
      cancelled = true;
      mm?.revert();
    };
    // deps are the caller's; scope is a ref and stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media, ...deps]);
}
