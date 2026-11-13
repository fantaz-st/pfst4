"use client";

import { useRef } from "react";
import { useGsap } from "@/components/motion/useGsap";
import styles from "./Magnetic.module.css";

// Hover devices only, and never under reduced motion (STYLEGUIDE §8).
const HOVER_DEVICE = "(hover: hover) and (pointer: fine)";

/**
 * Magnetic hover (STYLEGUIDE §8): the child follows the pointer — 30% of
 * the offset on x, 40% on y — through gsap.quickTo (0.6s). Wraps a single
 * button or link; the wrapper is what moves, so the child keeps its own
 * styles and stays a Server Component's output.
 */
export default function Magnetic({ children }) {
  const ref = useRef(null);

  useGsap(
    ({ gsap }) => {
      const el = ref.current;
      if (!el) return undefined;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });

      const move = (event) => {
        const rect = el.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * 0.3);
        yTo((event.clientY - rect.top - rect.height / 2) * 0.4);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { media: HOVER_DEVICE },
  );

  return (
    <span ref={ref} className={styles.magnetic}>
      {children}
    </span>
  );
}
