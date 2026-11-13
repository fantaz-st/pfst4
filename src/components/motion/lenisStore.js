"use client";

// The single Lenis instance (created by SmoothScroll), for components that
// need to pause page scrolling — e.g. while the mobile menu sheet is open.
// null under prefers-reduced-motion, where scrolling is native.
let instance = null;

export function setLenis(lenis) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}
