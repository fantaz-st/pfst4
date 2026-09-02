"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeaderScroll.module.css";

export default function HeaderScroll({ children }) {
  const slideRef = useRef(null);
  const heightRef = useRef(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const slide = slideRef.current;
    if (!slide) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resizeObserver = new ResizeObserver(() => {
      heightRef.current = slide.offsetHeight;
      setHeight(slide.offsetHeight);
    });
    resizeObserver.observe(slide);
    heightRef.current = slide.offsetHeight;
    setHeight(slide.offsetHeight);
    if (reducedMotion.matches) return () => resizeObserver.disconnect();

    let offset = 0;
    let lastY = window.scrollY;
    let frame = 0;

    function update() {
      frame = 0;
      const currentY = window.scrollY;
      offset = Math.max(
        0,
        Math.min(heightRef.current, offset + currentY - lastY),
      );
      lastY = currentY;
      slide.style.transform = `translateY(${-offset}px)`;
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={styles.wrapper}
      style={{ "--header-height": `${height}px` }}
    >
      <div className={styles.spacer} aria-hidden="true" />
      <div className={styles.sticky}>
        <div ref={slideRef} className={styles.slide}>
          {children}
        </div>
      </div>
    </div>
  );
}
