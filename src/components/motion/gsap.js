"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);


export const MOTION_OK = "(prefers-reduced-motion: no-preference)";


export const MEDIA = {
  aboveTablet: "(min-width: 1081px)",
  aboveTrack: "(min-width: 901px)",
  aboveMobile: "(min-width: 721px)",
};


export const EASE = {
  out: "expo.out",
  wipe: "expo.inOut",
  fade: "power3.out",
};

export { gsap, ScrollTrigger, SplitText };
