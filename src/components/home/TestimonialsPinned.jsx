"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TestimonialsPinned.module.css";

export default function TestimonialsPinned({ testimonials, label }) {
  const wrapRef = useRef(null);
  const quoteRefs = useRef([]);
  const timelineRef = useRef(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    if (testimonials.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frame = window.requestAnimationFrame(() => setEnhanced(true));
    return () => window.cancelAnimationFrame(frame);
  }, [testimonials.length]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const quotes = quoteRefs.current.filter(Boolean);
    if (!enhanced || !wrap || quotes.length < 2) return;
    let cancelled = false;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "+=" + quotes.length * 70 + "%",
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.set(quotes.slice(1), { opacity: 0 }, 0);

        quotes.forEach((el, i) => {
          if (i === 0) return;
          tl.to(quotes[i - 1], { opacity: 0, duration: 0.5 }, i * 0.9).to(
            el,
            { opacity: 1, duration: 0.5 },
            i * 0.9 + 0.2,
          );
        });

        timelineRef.current = tl;
        ScrollTrigger.refresh();
      },
    );

    return () => {
      cancelled = true;
      timelineRef.current?.scrollTrigger?.kill();
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [enhanced]);

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
