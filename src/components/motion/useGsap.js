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
 *   in Poppins, not in the fallback face.
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
// Each useGsap setup creates its triggers whenever its own fonts.ready
// callback runs, so components measure the page at different moments — a
// trigger made before another component changes the layout (PageMotion
// sizing the homepage news section) keeps stale positions. One debounced
// refresh after the last setup of a render measures them all together.
// The same moment ends the first-paint hiding (.motion-ready, globals.css):
// every intro tween has set its start values by now, so nothing flashes.
let refreshTimer;
function queueRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    ScrollTrigger.refresh();
    document.documentElement.classList.add("motion-ready");
  }, 100);
}

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
      queueRefresh();
    });

    return () => {
      cancelled = true;
      mm?.revert();
    };
    // deps are the caller's; scope is a ref and stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media, ...deps]);
}
