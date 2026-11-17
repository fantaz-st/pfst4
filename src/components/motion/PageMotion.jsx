"use client";

import { usePathname } from "next/navigation";
import { useGsap } from "./useGsap";
import { EASE } from "./gsap";

/**
 * Page-level motion stays outside the content tree and runs only when
 * prefers-reduced-motion is not set (useGsap).
 *
 * One-shot reveals (data-split, data-fade, data-stagger, data-home-clip,
 * data-post-cover) accept data-delay="0.3" — seconds added after the
 * reveal is triggered. Scrubbed effects ignore it (they follow the scroll).
 */

// data-delay="0.3" → 0.3; missing or not a number → 0.
const delayOf = (el) => Math.max(0, parseFloat(el?.dataset?.delay) || 0);
export default function PageMotion() {
  const pathname = usePathname();

  useGsap(
    ({ gsap, SplitText }) => {
      const splits = new Set();
      const hero = document.querySelector("[data-hero]");
      const media = hero?.querySelector("[data-hero-media]");
      const homeHero = document.querySelector("[data-home-hero]");
      const homeHeroMedia = homeHero?.querySelector("[data-hero-media]");
      const homeHeroContent = homeHero?.querySelector("[data-home-hero-content]");
      const intro = gsap.timeline({ defaults: { ease: EASE.out } });

      if (media) intro.from(media, { scale: 1.25, duration: 2 }, 0);
      intro.from("[data-hero-nav]", { y: -30, opacity: 0, duration: 1.2 }, 0.2);
      const heroFades = hero?.querySelectorAll("[data-hero-fade]") ?? [];
      if (heroFades.length) {
        intro.from(heroFades, { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.5);
      }

      document.querySelectorAll("[data-split]").forEach((el) => {
        const mode = el.getAttribute("data-split");
        if (mode === "words-scrub") return;
        const chars = mode === "chars";
        const split = SplitText.create(el, {
          type: chars ? "lines,chars" : "lines",
          mask: "lines",
          linesClass: "split-line",
        });
        splits.add(split);
        const vars = {
          yPercent: chars ? 110 : 105,
          rotate: chars ? 8 : 0,
          duration: chars ? 1.3 : 1.2,
          ease: EASE.out,
          stagger: chars ? 0.022 : 0.1,
          onComplete: () => {
            split.revert();
            splits.delete(split);
          },
        };
        const targets = chars ? split.chars : split.lines;
        if (hero?.contains(el)) {
          intro.from(targets, vars, 0.35 + delayOf(el));
        } else {
          gsap.from(targets, {
            ...vars,
            delay: delayOf(el),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        }
      });

      if (hero && media && !homeHero) {
        gsap.to(media, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      }

      if (homeHero) {
        const scrollTrigger = {
          trigger: homeHero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        };
        gsap.to(homeHero, {
          scale: 0.93,
          borderRadius: 44,
          ease: "none",
          scrollTrigger,
        });
        if (homeHeroMedia) {
          gsap.to(homeHeroMedia, { yPercent: 14, ease: "none", scrollTrigger });
        }
        if (homeHeroContent) {
          gsap.to(homeHeroContent, {
            y: -90,
            opacity: 0,
            ease: "none",
            scrollTrigger: { ...scrollTrigger, end: "60% top" },
          });
        }
      }

      const postCover = document.querySelector("[data-post-cover]");
      if (postCover) {
        gsap.fromTo(
          postCover,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: EASE.wipe,
            delay: delayOf(postCover),
            clearProps: "clipPath",
            scrollTrigger: { trigger: postCover, start: "top 90%", once: true },
          },
        );
      }

      const progress = document.querySelector("[data-post-progress]");
      const postArticle = document.querySelector("[data-post-article]");
      if (progress && postArticle) {
        gsap.to(progress, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: postArticle,
            start: "top 60%",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }

      // Reveal targets often carry a CSS `transition: transform` for their
      // hover lift. Left on, the browser re-transitions every frame GSAP
      // writes, so the element fades in first and only slides up ~0.5s
      // later. Transitions are switched off until the reveal has finished.
      gsap.utils.toArray("[data-fade]").forEach((el) => {
        gsap.set(el, { transition: "none" });
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 1.1,
          ease: EASE.fade,
          delay: delayOf(el),
          clearProps: "transform,transition",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      gsap.utils.toArray("[data-stagger]").forEach((el) => {
        gsap.set(el.children, { transition: "none" });
        gsap.from(el.children, {
          y: 60,
          opacity: 0,
          scale: 0.97,
          duration: 1.2,
          ease: EASE.out,
          stagger: 0.06,
          delay: delayOf(el),
          clearProps: "transform,transition",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      const homeMotion = gsap.matchMedia();
      // Study cards stack on every width: each card is sticky (CSS), and while
      // the next one slides over it, it shrinks a little and dims. The scrub
      // starts when the next card reaches its own sticky top, read from CSS
      // so the desktop and mobile offsets both line up.
      homeMotion.add("(min-width: 0px)", () => {
        const cards = gsap.utils.toArray("[data-home-study-card]");
        cards.forEach((card, index) => {
          const next = cards[index + 1];
          const dim = card.querySelector("[data-home-study-dim]");
          if (!next || !dim) return;
          const trigger = {
            trigger: next,
            start: () => `top ${parseFloat(getComputedStyle(next).top) || 104}px`,
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          };
          gsap.to(card, { scale: 0.9 + index * 0.02, scrollTrigger: trigger });
          gsap.to(dim, { opacity: 0.45, scrollTrigger: trigger });
        });
      });

      homeMotion.add("(min-width: 0px)", () => {
        const statementSplits = [];
        document.querySelectorAll("[data-home-statement]").forEach((el) => {
          const split = SplitText.create(el, { type: "words" });
          statementSplits.push(split);
          splits.add(split);
          const trigger = {
            trigger: el,
            start: "top 80%",
            end: "bottom 45%",
            scrub: true,
          };
          gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: trigger });
          gsap.from(el.querySelectorAll("[data-home-pill]"), {
            width: 0,
            marginLeft: 0,
            marginRight: 0,
            ease: "none",
            stagger: 0.3,
            scrollTrigger: trigger,
          });
          // The photo inside each pill settles from a slight zoom as it opens.
          gsap.from(el.querySelectorAll("[data-home-pill-media]"), {
            scale: 1.4,
            ease: "none",
            stagger: 0.3,
            scrollTrigger: trigger,
          });
        });
        return () => {
          statementSplits.forEach((split) => {
            split.revert();
            splits.delete(split);
          });
        };
      });

      document.querySelectorAll("[data-home-clip]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(40% 20% 40% 20% round 32px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 32px)",
            duration: 1.6,
            ease: EASE.wipe,
            delay: delayOf(el),
            scrollTrigger: { trigger: el, start: "top bottom+=250", once: true },
          },
        );
      });

      return () => {
        homeMotion.revert();
        splits.forEach((split) => split.revert());
      };
    },
    { deps: [pathname] },
  );

  return null;
}
