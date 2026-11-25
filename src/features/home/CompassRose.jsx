"use client";

import { useRef } from "react";
import { useGsap } from "@/components/motion/useGsap";
import { CENTRE, DIAL, NEEDLES, VIEWBOX } from "./compassRoseArt";
import styles from "./CompassRose.module.css";

/**
 * Decorative PFST compass rose, drawn as a dial seen at an angle. The dial
 * (rings, ticks, letters) stays put; the needles turn on the dial as the
 * page scrolls: 0° → `degrees` while `trigger` (default: the compass's
 * parent) crosses the viewport. Off under prefers-reduced-motion (useGsap).
 * Purely decorative: aria-hidden.
 *
 * Position and size come from the parent's CSS module (absolute + width +
 * height); this component only draws. The angle is two CSS variables on
 * .compass — --tilt (how far the dial leans back) and --turn (how the
 * leaning dial sits on screen) — override them from the parent if needed.
 *
 * @param {{ tone?: "onDark" | "onLight" | "brand", degrees?: number, trigger?: string, className?: string }} props
 */
function Shape({ shape }) {
  const [Tag, attributes, tone] = shape;
  return <Tag {...attributes} className={styles[tone]} />;
}

export default function CompassRose({ tone = "onDark", degrees = 220, trigger, className }) {
  const needlesRef = useRef(null);

  useGsap(
    ({ gsap }) => {
      const needles = needlesRef.current;
      const svg = needles?.ownerSVGElement;
      if (!needles || !svg) return;
      const triggerEl = trigger ? document.querySelector(trigger) : svg.parentElement;
      gsap.to(needles, {
        rotation: degrees,
        svgOrigin: CENTRE,
        ease: "none",
        scrollTrigger: { trigger: triggerEl ?? svg, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { deps: [degrees, trigger] },
  );

  return (
    <svg
      className={[styles.compass, styles[tone], className].filter(Boolean).join(" ")}
      viewBox={VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      <g>
        {DIAL.map((shape, index) => (
          <Shape key={index} shape={shape} />
        ))}
      </g>
      <g ref={needlesRef}>
        {NEEDLES.map((shape, index) => (
          <Shape key={index} shape={shape} />
        ))}
      </g>
    </svg>
  );
}
