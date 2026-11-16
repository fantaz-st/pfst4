"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import { gsap, MOTION_OK } from "./gsap";
import styles from "./ReadCursor.module.css";

/**
 * "Pročitaj →" pill that follows the pointer over a card's image
 * (STYLEGUIDE hover H). Put it inside the element it should track — that
 * element needs `position: relative` and hides the cursor itself (see
 * NewsCard.module.css). It shows on hover and, centred, on keyboard focus
 * of the card. Follows the pointer only on hover-capable devices without
 * reduced motion; otherwise it stays centred. Decorative: aria-hidden.
 */
export default function ReadCursor({ label }) {
  const ref = useRef(null);

  useEffect(() => {
    const pill = ref.current;
    const box = pill?.parentElement;
    if (!box) return undefined;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (hover: hover)`, () => {
      const xTo = gsap.quickTo(pill, "left", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(pill, "top", { duration: 0.4, ease: "power3" });
      const move = (event) => {
        const rect = box.getBoundingClientRect();
        xTo(event.clientX - rect.left);
        yTo(event.clientY - rect.top);
      };
      const enter = (event) => {
        // Start under the pointer instead of sliding in from the centre.
        const rect = box.getBoundingClientRect();
        gsap.set(pill, { left: event.clientX - rect.left, top: event.clientY - rect.top });
      };
      const leave = () => {
        xTo(box.clientWidth / 2);
        yTo(box.clientHeight / 2);
      };
      box.addEventListener("pointerenter", enter);
      box.addEventListener("pointermove", move);
      box.addEventListener("pointerleave", leave);
      return () => {
        box.removeEventListener("pointerenter", enter);
        box.removeEventListener("pointermove", move);
        box.removeEventListener("pointerleave", leave);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <span ref={ref} className={styles.pill} aria-hidden="true">
      {label}
      <Icon name="arrow" size={14} />
    </span>
  );
}
