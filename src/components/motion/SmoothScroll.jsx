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

      return () => {
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
