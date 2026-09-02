"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./IstaknutoScroller.module.css";

export default function IstaknutoScroller({ posts, label }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || posts.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const distance = () =>
          Math.max(0, track.scrollWidth - wrap.clientWidth);

        setEnhanced(true);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => "+=" + (distance() + wrap.clientHeight * 0.5),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        scrollTriggerRef.current = tween.scrollTrigger;
      },
    );

    return () => {
      cancelled = true;
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;
    };
  }, [posts.length]);

  function focusCard(index) {
    const trigger = scrollTriggerRef.current;
    if (!trigger || posts.length < 2) return;
    const progress = index / (posts.length - 1);
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * progress,
    });
  }

  return (
    <section
      ref={wrapRef}
      aria-label={label}
      className={`${styles.wrap} ${enhanced ? styles.enhanced : ""}`}
    >
      <span className={styles.label} aria-hidden="true">
        {label}
      </span>
      <ul
        ref={trackRef}
        className={`${styles.track} ${enhanced ? styles.enhanced : ""}`}
      >
        {posts.map((post, index) => (
          <li
            key={post.id}
            className={styles.item}
            onFocus={() => focusCard(index)}
          >
            <article className={styles.card}>
              <Link
                href={post.uri}
                className={styles.imageLink}
                tabIndex={-1}
                aria-hidden="true"
              >
                {post.featuredImage?.node && (
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt=""
                    fill
                    sizes="(max-width: 64rem) 76vw, 63.75rem"
                    className={styles.image}
                  />
                )}
              </Link>
              <h3 className={styles.title}>
                <Link href={post.uri}>{post.title}</Link>
              </h3>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
