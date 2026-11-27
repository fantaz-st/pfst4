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
    ({ gsap, ScrollTrigger, SplitText }) => {
      const splits = new Set();
      const hero = document.querySelector("[data-hero]");
      const media = hero?.querySelector("[data-hero-media]");
      const homeHero = document.querySelector("[data-home-hero]");
      const homeHeroMedia = homeHero?.querySelector("[data-hero-media]");
      const homeHeroContent = homeHero?.querySelector("[data-home-hero-content]");
      const intro = gsap.timeline({ defaults: { ease: EASE.out } });

      // fromTo: the CSS first-paint state already scales the media to 1.25
      // (globals.css, html:not(.motion-ready)), so from() would read 1.25 as
      // its end.
      if (media) intro.fromTo(media, { scale: 1.25 }, { scale: 1, duration: 2 }, 0);
      intro.from("[data-hero-nav]", { y: -30, opacity: 0, duration: 1.2 }, 0.2);
      const heroFades = hero?.querySelectorAll("[data-hero-fade]") ?? [];
      if (heroFades.length) {
        intro.from(heroFades, { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.5);
      }

      // Home hero photo fan (features/home/HomeHero): the fan slides up
      // from below the hero's bottom edge (the hero clips it) with every
      // card stacked behind the centre one, untilted; then each spreads out
      // to its place — nearest pair first — and the chips and flags pop in.
      // Positions come from layout offsets, which ignore the tilt; cards
      // hidden on phones (no offsetParent) are skipped.
      const fan = homeHero?.querySelector("[data-hero-fan]");
      const fanCenter = fan?.querySelector("[data-fan-center]");
      if (fan && fanCenter) {
        const rise = homeHero.getBoundingClientRect().bottom - fan.getBoundingClientRect().top;
        // The rise overshoots a touch and settles (back.out(1): ~4% of the
        // distance). The spread starts while it is still settling (by 35%
        // the rise has covered ~87% of the distance), so the two read as one
        // move; the chips and flags follow the spread. All timed off the rise.
        const riseStart = 0.5;
        const riseDuration = 0.75;
        const spreadStart = riseStart + riseDuration * 0.35;
        intro.from(fan, { y: rise, duration: riseDuration, ease: "back.out(1)" }, riseStart);
        const cx = fanCenter.offsetLeft + fanCenter.offsetWidth / 2;
        const cy = fanCenter.offsetTop + fanCenter.offsetHeight / 2;
        const cards = gsap.utils
          .toArray("[data-fan-card]", fan)
          .filter((card) => card !== fanCenter && card.offsetParent)
          .map((card) => ({
            card,
            dx: cx - (card.offsetLeft + card.offsetWidth / 2),
            dy: cy - (card.offsetTop + card.offsetHeight / 2),
            tilt: parseFloat(getComputedStyle(card).rotate) || 0,
          }))
          .sort((a, b) => Math.abs(a.dx) - Math.abs(b.dx));
        cards.forEach(({ card, dx, dy, tilt }, index) => {
          intro.from(card, { x: dx, y: dy, rotation: -tilt, scale: 0.92, duration: 1.1, ease: EASE.out }, spreadStart + Math.floor(index / 2) * 0.06);
        });
        const extras = fan.querySelectorAll("[data-fan-extra]");
        if (extras.length) {
          intro.from(extras, { scale: 0, opacity: 0, duration: 0.8, stagger: 0.07, ease: "back.out(2)" }, spreadStart + 0.45);
        }
      }

      document.querySelectorAll("[data-split]").forEach((el) => {
        const mode = el.getAttribute("data-split");
        if (mode === "words-scrub") return;
        const chars = mode === "chars";
        const split = SplitText.create(el, {
          // Chars sit inside word wrappers so a line can only break between
          // words — bare chars let the browser break mid-word while split.
          type: chars ? "lines,words,chars" : "lines",
          mask: "lines",
          linesClass: "split-line",
          charsClass: "split-char",
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

      // Timetable wall in the "Raspored nastave" quick link: each column loops
      // by one copy of its cards (alternate columns reversed). Still until the tile is near, then the columns start fast
      // and ease into their slow drift over 4s.
      homeMotion.add("(min-width: 0px)", () => {
        // Every wall on the page: the home hero's timetable card and the
        // quick-links tile can both carry one.
        const START_SPEED = 60;
        document.querySelectorAll("[data-timetable-wall]").forEach((wall) => {
          // One loop = one copy of the cards (TimetableMarquee renders COPIES).
          const step = -100 / (Number(wall.dataset.copies) || 2);
          const loops = gsap.utils.toArray("[data-wall-column]", wall).map((column) => {
            const reverse = column.dataset.reverse === "true";
            return gsap.fromTo(
              column,
              { yPercent: reverse ? step : 0 },
              { yPercent: reverse ? 0 : step, duration: Number(column.dataset.duration) || 60, ease: "none", repeat: -1, paused: true },
            );
          });
          // Trigger on the tile-sized marquee box, never the wall itself: the
          // tilted wall (4 copies per column) reaches far above the tile —
          // above the fold even with the hero in view — so ScrollTrigger would
          // count it as already passed and fire on page load. "top bottom" =
          // the moment the tile's top edge enters the screen.
          ScrollTrigger.create({
            trigger: wall.parentElement,
            start: "top bottom",
            once: true,
            onEnter: () =>
              loops.forEach((loop) => {
                loop.play();
                gsap.fromTo(loop, { timeScale: START_SPEED }, { timeScale: 1, duration: 4, ease: EASE.fade });
              }),
          });
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

      // Homepage "Ostale novosti": the lead card wipes open from the top while
      // its photo settles from a zoom; the rows rise in a stagger and each
      // date tile's day number rolls up inside its tile.
      const newsLead = document.querySelector("[data-news-lead]");
      if (newsLead) {
        const scrollTrigger = { trigger: newsLead, start: "top 88%", once: true };
        gsap.fromTo(
          newsLead,
          { clipPath: "inset(0% 0% 100% 0% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.4, ease: EASE.wipe, clearProps: "clipPath", scrollTrigger },
        );
        const leadMedia = newsLead.querySelector("[data-news-lead-media]");
        if (leadMedia?.firstElementChild) gsap.from(leadMedia.firstElementChild, { scale: 1.3, duration: 1.8, ease: EASE.out, clearProps: "transform", scrollTrigger });
      }
      document.querySelectorAll("[data-news-rows]").forEach((list) => {
        const scrollTrigger = { trigger: list, start: "top 90%", once: true };
        gsap.from(list.children, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: EASE.out,
          stagger: 0.06,
          clearProps: "transform,opacity",
          scrollTrigger,
        });
        gsap.from(list.querySelectorAll("[data-news-day]"), {
          yPercent: 130,
          duration: 0.9,
          ease: EASE.out,
          stagger: 0.06,
          delay: 0.2,
          clearProps: "transform",
          scrollTrigger,
        });
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
