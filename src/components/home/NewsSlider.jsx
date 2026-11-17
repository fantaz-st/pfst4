"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Icon from "@/components/ui/Icon";
import styles from "./NewsSlider.module.css";

/**
 * Homepage featured-news slider on Embla. Three pieces sharing one carousel:
 *
 *   <NewsSlider>                          provider (holds the Embla instance)
 *     …heading row… <NewsSliderControls/> arrows + progress, anywhere inside
 *     <NewsSliderViewport>{cards}</…>     the sliding row
 *   </NewsSlider>
 *
 * The cards are passed in as children from the Server Component, so they
 * stay server-rendered; only this shell hydrates. Mouse drag, touch swipe,
 * trackpad (wheel-gestures plugin) and the arrows all move it; tabbing to a
 * card brings it into view (Embla's watchFocus). Photos inside the cards
 * drift sideways as they cross the viewport (parallax, off under reduced
 * motion).
 */

const SliderContext = createContext(null);

const PARALLAX = 20; // max photo shift, % of the photo's width (photo is scaled 1.14)

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Align each card with the row's left padding (the page's content edge).
// Read from the row whenever Embla measures (init and every resize), so it
// follows the CSS at every breakpoint.
const insetOf = (node) => (node ? parseFloat(getComputedStyle(node).paddingLeft) || 0 : 0);

export default function NewsSlider({ children }) {
  const containerRef = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: () => insetOf(containerRef.current),
      containScroll: "trimSnaps",
      skipSnaps: true,
      duration: reducedMotion() ? 10 : 28,
    },
    [WheelGesturesPlugin()],
  );

  return <SliderContext.Provider value={{ emblaRef, emblaApi, containerRef }}>{children}</SliderContext.Provider>;
}

/** The sliding row. Its direct children are the slides. */
export function NewsSliderViewport({ label, className, containerClassName, children }) {
  const { emblaRef, emblaApi, containerRef } = useContext(SliderContext);
  const photos = useRef([]);
  const viewWidth = useRef(0);

  // Parallax: shift each photo by where its card sits in the viewport —
  // −PARALLAX % entering on the right, +PARALLAX % leaving on the left.
  // Uses Embla's own measurements (no DOM reads per frame) and the
  // `translate` property, so it stacks with the hover zoom's `transform`.
  useEffect(() => {
    if (!emblaApi || reducedMotion()) return undefined;
    const measure = () => {
      photos.current = emblaApi.slideNodes().map((slide) => slide.querySelector("img"));
      viewWidth.current = emblaApi.rootNode().clientWidth;
    };
    const tween = () => {
      const engine = emblaApi.internalEngine();
      const offset = engine.offsetLocation.get();
      const start = engine.containerRect.left;
      const half = viewWidth.current / 2;
      engine.slideRects.forEach((rect, index) => {
        const photo = photos.current[index];
        if (!photo) return;
        const center = rect.left - start + rect.width / 2 + offset;
        const position = (center - half) / (half + rect.width / 2); // −1 … 1 across the viewport
        const shift = Math.max(-1, Math.min(1, position)) * -PARALLAX;
        photo.style.translate = `${shift.toFixed(2)}% 0`;
      });
    };
    measure();
    tween();
    emblaApi.on("scroll", tween).on("reInit", measure).on("reInit", tween).on("slidesChanged", measure);
    return () => {
      emblaApi.off("scroll", tween).off("reInit", measure).off("reInit", tween).off("slidesChanged", measure);
      photos.current.forEach((photo) => photo?.style.removeProperty("translate"));
    };
  }, [emblaApi]);

  return (
    <div
      ref={emblaRef}
      className={[styles.viewport, className].filter(Boolean).join(" ")}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      data-lenis-prevent-horizontal
    >
      <div ref={containerRef} className={[styles.container, containerClassName].filter(Boolean).join(" ")}>
        {children}
      </div>
    </div>
  );
}

/** Prev / next arrows and a progress bar for the surrounding NewsSlider. */
export function NewsSliderControls({ prevLabel, nextLabel, className }) {
  const { emblaApi } = useContext(SliderContext);
  const barRef = useRef(null);
  const [can, setCan] = useState({ prev: false, next: true });

  const update = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0.08, progress)})`;
    const next = { prev: emblaApi.canScrollPrev(), next: emblaApi.canScrollNext() };
    setCan((current) => (current.prev === next.prev && current.next === next.next ? current : next));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const frame = requestAnimationFrame(update); // first paint of the bar / arrows
    emblaApi.on("scroll", update).on("select", update).on("reInit", update);
    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("scroll", update).off("select", update).off("reInit", update);
    };
  }, [emblaApi, update]);

  return (
    <div className={[styles.controls, className].filter(Boolean).join(" ")}>
      <span className={styles.progress} aria-hidden="true">
        <span ref={barRef} />
      </span>
      <button type="button" className={styles.button} aria-label={prevLabel} disabled={!can.prev} onClick={() => emblaApi?.scrollPrev()}>
        <Icon name="arrow" size={18} className={styles.back} />
      </button>
      <button type="button" className={styles.button} aria-label={nextLabel} disabled={!can.next} onClick={() => emblaApi?.scrollNext()}>
        <Icon name="arrow" size={18} />
      </button>
    </div>
  );
}
