"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/components/motion/gsap";
import styles from "./HoverOptions.module.css";

// TODO: styleguide-only demo — fake posts, placeholder images (CLAUDE.md).
// Hover options for a post card: text (A–C), image (D–I) and three
// suggested combinations. Each option is a class on the card, so a chosen
// one moves to NewsCard as-is. Every hover state also applies on
// :focus-visible; prefers-reduced-motion turns the transitions off.

const POSTS = [
  { date: "28. 10. 2025.", chip: "Najave", title: "[Uspješan nastup studenata na Europskom prvenstvu u jedrenju]" },
  { date: "25. 10. 2025.", chip: "Najave", title: "[PFST na 25. godišnjoj skupštini IAMU]" },
  { date: "15. 04. 2026.", chip: "Istaknuto", title: "[PFST Career Day 2026.]" },
];

const OPTIONS = [
  { id: "A", group: "Tekst", name: "Crta se iscrtava", fx: ["draw"], post: 0, spec: "podcrta 0→100 %, 1,5 px · ulazi slijeva, izlazi udesno · 0,6 s · radi na više redaka" },
  { id: "B", group: "Tekst", name: "Marker", fx: ["marker"], post: 1, light: true, spec: "nijansa plava 1 na 44 % visine retka · box-decoration-break: clone · 0,7 s" },
  { id: "C", group: "Tekst", name: "Strelica na kraju", fx: ["arrow"], post: 0, spec: "naslov x +6 px · strelica ulazi s −10 px · 0,6 s" },
  { id: "D", group: "Slika + oznaka", name: "Spori zoom, oznaka u modro", fx: ["zoom", "chipFlip"], post: 2, light: true, spec: "scale 1→1,07 · 1,2 s · oznaka postaje modra" },
  { id: "E", group: "Slika", name: "Okvir se uvlači", fx: ["inset"], post: 0, spec: "clip-path inset(10 px round 14) · unutra scale 1,1 · 0,8 s" },
  { id: "F", group: "Slika", name: "Zaobljenje", fx: ["round", "zoom"], post: 1, light: true, spec: "radius 20 → 64 px · zoom 1,07 · 0,7 s" },
  { id: "G", group: "Slika", name: "Boja na hover", fx: ["colour", "zoom"], post: 1, spec: "saturate .1 + brightness 1,15 → puna boja · 0,7 s" },
  { id: "H", group: "Slika", name: "Kursor „Pročitaj”", fx: ["cursor"], post: 2, light: true, spec: "pilula prati miš (quickTo 0,4 s) · samo (hover: hover)" },
  { id: "I", group: "Slika", name: "Signalne zastave", fx: ["flags", "zoom"], post: 0, spec: "traka zastava 64 px izlazi odozdo · 0,7 s" },
];

const COMBOS = [
  { id: "1", group: "Mirno", name: "A + E", fx: ["draw", "inset"], post: 0, spec: "Smireno i sigurno — za popis novosti." },
  { id: "2", group: "Razigrano", name: "H + D", fx: ["cursor", "zoom", "chipFlip"], post: 2, light: true, spec: "Za horizontalnu traku na naslovnici." },
  { id: "3", group: "Brendirano", name: "C + I", fx: ["arrow", "flags", "zoom"], post: 1, spec: "Za istaknutu objavu." },
];

function Arrow({ className, size = 18 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DemoCard({ option }) {
  const post = POSTS[option.post];
  const fx = option.fx.map((name) => styles[name]);
  const has = (name) => option.fx.includes(name);

  return (
    <div className={styles.option}>
      <div className={styles.head}>
        <span className={styles.label}>
          {option.id} · {option.group}
        </span>
        <span className={styles.name}>{option.name}</span>
      </div>

      <a href="#" className={[styles.card, ...fx].join(" ")} onClick={(event) => event.preventDefault()}>
        <span className={`${styles.image} ${option.light ? styles.light : ""}`} data-hover-cursor={has("cursor") ? "" : undefined}>
          <span className={styles.media} />
          {has("flags") && <span className={styles.flagBand} aria-hidden="true" />}
          {has("cursor") && (
            <span className={styles.cursorPill} aria-hidden="true">
              Pročitaj <Arrow size={14} />
            </span>
          )}
        </span>
        <span className={styles.meta}>
          <span>{post.date}</span>
          <span className={styles.chip}>{post.chip}</span>
        </span>
        <span className={styles.title}>
          <span>{post.title}</span>
          {has("arrow") && <Arrow className={styles.titleArrow} />}
        </span>
      </a>

      <p className={styles.spec}>{option.spec}</p>
    </div>
  );
}

export default function HoverOptions() {
  const ref = useRef(null);

  // H: the "Pročitaj" pill follows the pointer over the image. Pointer
  // devices only, and off under reduced motion (the pill then stays centred).
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (hover: hover)`, () => {
      const offs = [];
      root.querySelectorAll("[data-hover-cursor]").forEach((box) => {
        const pill = box.querySelector(`.${styles.cursorPill}`);
        if (!pill) return;
        const xTo = gsap.quickTo(pill, "left", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(pill, "top", { duration: 0.4, ease: "power3" });
        const move = (event) => {
          const rect = box.getBoundingClientRect();
          xTo(event.clientX - rect.left);
          yTo(event.clientY - rect.top);
        };
        const leave = () => {
          xTo(box.clientWidth / 2);
          yTo(box.clientHeight / 2);
        };
        box.addEventListener("pointermove", move);
        box.addEventListener("pointerleave", leave);
        offs.push(() => {
          box.removeEventListener("pointermove", move);
          box.removeEventListener("pointerleave", leave);
        });
      });
      return () => offs.forEach((off) => off());
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={styles.root}>
      <div className={styles.grid}>
        {OPTIONS.map((option) => (
          <DemoCard key={option.id} option={option} />
        ))}
      </div>
      <p className={styles.groupLabel}>Predložene kombinacije</p>
      <div className={styles.grid}>
        {COMBOS.map((option) => (
          <DemoCard key={option.id} option={option} />
        ))}
      </div>
    </div>
  );
}
