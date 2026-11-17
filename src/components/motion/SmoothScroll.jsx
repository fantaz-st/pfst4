"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION_OK } from "./gsap";
import { setLenis } from "./lenisStore";

// Lenis smooth scrolling for the whole site, driven by GSAP's ticker so
// ScrollTrigger stays in sync (STYLEGUIDE §8). Mounted once per root
// layout; renders nothing, so the page tree stays Server Components.
// Under prefers-reduced-motion Lenis never starts and scrolling is native.
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef(null);
  const lastPathname = useRef(pathname);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenisRef.current = lenis;
      setLenis(lenis);

      // Keep every ScrollTrigger's start/end in sync with the page height.
      // ScrollTrigger only re-measures on resize and on the window `load`
      // event; anything that changes the page's height afterwards — the
      // homepage news section sizing itself (PageMotion), "Prikaži još",
      // late images — leaves triggers further down measured against the old
      // layout. On a reload where `load` fired before the motion setup ran
      // (fonts cached, so document.fonts.ready resolved late), nothing
      // re-measured at all, and e.g. the compass's scrub was already at its
      // end by the time its card scrolled into view. Watch the body and
      // refresh (debounced) whenever its height really changes.
      let refreshTimer;
      let lastHeight = document.body.scrollHeight;
      const resizeObserver = new ResizeObserver(() => {
        const height = document.body.scrollHeight;
        if (Math.abs(height - lastHeight) < 2) return;
        lastHeight = height;
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
      });
      resizeObserver.observe(document.body);

      return () => {
        resizeObserver.disconnect();
        clearTimeout(refreshTimer);
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        lenisRef.current = null;
        setLenis(null);
      };
    });
    return () => mm.revert();
  }, []);

  // A client-side navigation lands at the top of the new page; jump Lenis
  // there too so its internal position doesn't animate back down. Skipped on
  // first load, which must keep the browser's restored scroll / #anchor.
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
