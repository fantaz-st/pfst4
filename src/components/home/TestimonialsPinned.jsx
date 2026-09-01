"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TestimonialsPinned.module.css";

// Pinned, full-screen crossfade of testimonial quotes — matches
// design/PFST Naslovnica v4.dc.html's [data-qwrap]/[data-quote] section
// (pin + crossfade timeline) exactly.
//
// The source hardcodes quotes 2+ as `style="opacity:0"` directly in the raw
// HTML, so without JS only the first testimonial is visible at all — the
// same accessibility gap as Istaknuto's pinned track. The unenhanced state
// here is a plain grid instead: all testimonials visible, normal document
// flow, no absolute positioning. GSAP only pins and crossfades once it has
// mounted and prefers-reduced-motion allows it, matching each quote's own
// initial opacity via its scrub-timeline "from" state rather than a
// pre-baked inline style.
export default function TestimonialsPinned({ testimonials, label }) {
  const wrapRef = useRef(null);
  const quoteRefs = useRef([]);
  const timelineRef = useRef(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const quotes = quoteRefs.current.filter(Boolean);
    if (!wrap || quotes.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        setEnhanced(true);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "+=" + quotes.length * 60 + "%",
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        quotes.forEach((el, i) => {
          if (i === 0) return;
          tl.to(quotes[i - 1], { opacity: 0, yPercent: -12, duration: 0.5, ease: "power2.in" }, i * 0.9).fromTo(
            el,
            { opacity: 0, yPercent: 14 },
            { opacity: 1, yPercent: 0, duration: 0.5, ease: "power2.out" },
            i * 0.9 + 0.2,
          );
        });

        timelineRef.current = tl;
      },
    );

    return () => {
      cancelled = true;
      timelineRef.current?.scrollTrigger?.kill();
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [testimonials.length]);

  return (
    <section
      ref={wrapRef}
      aria-label={label}
      className={`${styles.wrap} ${enhanced ? styles.enhanced : ""}`}
    >
      <span className={styles.label} aria-hidden="true">
        {label}
      </span>
      <div className={`${styles.inner} ${enhanced ? styles.enhanced : ""}`}>
        {testimonials.map((item, index) => (
          <blockquote
            key={index}
            ref={(el) => (quoteRefs.current[index] = el)}
            className={styles.quote}
          >
            <p>{item.quote}</p>
            <footer>
              {item.name} — {item.role}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
