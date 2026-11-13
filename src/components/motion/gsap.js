"use client";

// The one place GSAP is set up. Import gsap and its plugins from here, never
// from "gsap" directly, so plugin registration happens exactly once.
// Only "use client" motion components may import this (see CLAUDE.md).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// All motion runs only under this query (STYLEGUIDE §8): reduced motion
// disables every animation and Lenis.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// Design breakpoints, for media-scoped animations (e.g. the news track only
// at ≥900px). Media queries can't read CSS variables, so they're literal.
export const MEDIA = {
  aboveTablet: "(min-width: 1081px)",
  aboveTrack: "(min-width: 901px)",
  aboveMobile: "(min-width: 721px)",
};

// STYLEGUIDE §8 easing and durations.
export const EASE = {
  out: "expo.out",
  wipe: "expo.inOut",
  fade: "power3.out",
};

export { gsap, ScrollTrigger, SplitText };
