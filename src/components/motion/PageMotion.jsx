"use client";

import { usePathname } from "next/navigation";
import { useGsap } from "./useGsap";
import { EASE } from "./gsap";

/**
 * Page-level motion (STYLEGUIDE §8, design/reference/inner.js), driven by
 * data attributes so the page tree stays Server Components:
 * - hero intro on load: [data-hero-media] scale 1.25 → 1, the nav bar
 *   ([data-hero-nav]) and [data-hero-fade] items fade up
 * - hero parallax: [data-hero-media] yPercent 12, scrubbed
 * - [data-fade]: y 32 + fade, 1.1s power3.out, once at top 92%
 * - [data-stagger]: children y 60 + scale .97, stagger .06, once at top 88%
 * Split-text titles are handled by <SplitReveal>. Re-runs per navigation;
 * under reduced motion nothing runs (useGsap).
 */
export default function PageMotion() {
  const pathname = usePathname();

  useGsap(
    ({ gsap }) => {
      const hero = document.querySelector("[data-hero]");
      const media = hero?.querySelector("[data-hero-media]");

      const intro = gsap.timeline({ defaults: { ease: EASE.out } });
      if (media) intro.from(media, { scale: 1.25, duration: 2 }, 0);
      intro.from("[data-hero-nav]", { y: -30, opacity: 0, duration: 1.2 }, 0.2);
      const heroFades = hero ? hero.querySelectorAll("[data-hero-fade]") : [];
      if (heroFades.length) {
        intro.from(heroFades, { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.5);
      }

      if (hero && media) {
        gsap.to(media, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      }

      gsap.utils.toArray("[data-fade]").forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 1.1,
          ease: EASE.fade,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      gsap.utils.toArray("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          y: 60,
          opacity: 0,
          scale: 0.97,
          duration: 1.2,
          ease: EASE.out,
          stagger: 0.06,
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    },
    { deps: [pathname] },
  );

  return null;
}
