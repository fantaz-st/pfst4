"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/components/motion/gsap";
import styles from "./FlagPlaceholder.module.css";

/**
 * Fallback for news without a featured image (Photo fallback="flags"):
 * a plain modra (tone="dark") or pale plava (tone="light") field where
 * signal-flag tiles from design/flags.svg come and go — up to two clusters
 * of 2–4 touching flags plus up to four lone flags at a time, never
 * touching each other. Tiles sit on a 10-column grid (tile = 10% of the width, via
 * container units) and flip in and out one after another.
 *
 * Server-rendered as a fixed arrangement, which is also what no-JS and
 * reduced-motion visitors keep. The animation runs only while the field is
 * on screen. Decorative, so aria-hidden.
 */

const COLS = 10;

// Density and pace — tune here.
const MAX_CLUSTERS = 2;
const MAX_LONERS = 4;
const SPAWN_EVERY = 450; // ms between spawn attempts
const CLUSTER_HOLD = [2600, 3600]; // ms on screen, min–max
const LONER_HOLD = [1600, 2600];
const FLIP_STAGGER = 90; // ms between tiles of a cluster

// Flag designs on a 100×100 tile; c = colour role (p plava, m modra,
// w bijela, b the tone's base, which must stay visible on the field).
const DESIGNS = [
  [["rect", 0, 0, 100, 25, "p"], ["rect", 0, 25, 100, 25, "m"], ["rect", 0, 50, 100, 25, "p"], ["rect", 0, 75, 100, 25, "m"]],
  [["rect", 0, 0, 100, 100, "b"], ["rect", 40, 0, 20, 100, "p"], ["rect", 0, 40, 100, 20, "p"]],
  [["rect", 0, 0, 100, 100, "b"], ["poly", "0,0 100,0 0,100", "p"]],
  [["rect", 0, 0, 34, 100, "w"], ["rect", 34, 0, 33, 100, "m"], ["rect", 67, 0, 33, 100, "p"]],
  [["rect", 0, 0, 100, 100, "p"], ["poly", "0,0 14,0 100,86 100,100 86,100 0,14", "m"], ["poly", "100,0 100,14 14,100 0,100 0,86 86,0", "m"]],
  [["rect", 0, 0, 100, 100, "p"], ["rect", 22, 22, 56, 56, "m"], ["rect", 38, 38, 24, 24, "w"]],
  [["rect", 0, 0, 100, 100, "p"], ["circle", 50, 50, 24, "m"]],
  [["rect", 0, 0, 100, 100, "w"], ["poly", "0,100 100,0 100,100", "b"]],
];

// Cluster shapes as [col, row] offsets.
const SHAPES = [
  [[0, 0], [1, 0]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [0, 1]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [1, 1]],
];

// First paint / no JS / reduced motion: two clusters and three lone flags.
const STATIC_TILES = [
  { c: 1, r: 1, d: 5 },
  { c: 2, r: 1, d: 0 },
  { c: 1, r: 2, d: 2 },
  { c: 6, r: 4, d: 3 },
  { c: 7, r: 4, d: 7 },
  { c: 7, r: 1, d: 6 },
  { c: 4, r: 3, d: 1 },
  { c: 2, r: 5, d: 4 },
];

const ROLE = { p: styles.p, m: styles.m, w: styles.w, b: styles.b };

function shapeMarkup([type, ...rest]) {
  const role = ROLE[rest[rest.length - 1]];
  if (type === "rect") {
    const [x, y, width, height] = rest;
    return `<rect class="${role}" x="${x}" y="${y}" width="${width}" height="${height}"/>`;
  }
  if (type === "circle") {
    const [cx, cy, r] = rest;
    return `<circle class="${role}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  }
  return `<polygon class="${role}" points="${rest[0]}"/>`;
}

const svgMarkup = (design) =>
  `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${DESIGNS[design].map(shapeMarkup).join("")}</svg>`;

export default function FlagPlaceholder({ tone = "dark", className }) {
  const rootRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const layer = layerRef.current;
    if (!root || !layer) return undefined;

    // Only while motion is allowed; turning on "reduce motion" mid-visit
    // stops the flips and brings the fixed arrangement back.
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => animate(root, layer));
    return () => mm.revert();
  }, []);

  return (
    <span ref={rootRef} className={[styles.field, styles[tone], className].filter(Boolean).join(" ")} aria-hidden="true">
      <span className={styles.static}>
        {STATIC_TILES.map((tile) => (
          <span
            key={`${tile.c}-${tile.r}`}
            className={`${styles.tile} ${styles.on}`}
            style={{ "--c": tile.c, "--r": tile.r }}
            dangerouslySetInnerHTML={{ __html: svgMarkup(tile.d) }}
          />
        ))}
      </span>
      <span ref={layerRef} className={styles.layer} />
    </span>
  );
}

// Runs the live field while it is on screen; returns the cleanup.
function animate(root, layer) {
  const timers = new Set();
  const taken = new Set();
  let clusters = 0;
  let loners = 0;
  let running = false;
  let loop = 0;

  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const key = (c, r) => `${c},${r}`;
  const rowCount = () => Math.max(1, Math.floor(root.clientHeight / (root.clientWidth / COLS)));
  // Inside the grid, and no other tile in the 8 cells around any of ours.
  const fits = (cells, rows) =>
    cells.every(([c, r]) => c >= 0 && r >= 0 && c < COLS && r < rows) &&
    cells.every(([c, r]) => {
      for (let dc = -1; dc <= 1; dc += 1) {
        for (let dr = -1; dr <= 1; dr += 1) if (taken.has(key(c + dc, r + dr))) return false;
      }
      return true;
    });

  function spawn(cluster) {
    const rows = rowCount();
    const shape = cluster ? pick(SHAPES) : [[0, 0]];
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const c0 = Math.floor(Math.random() * COLS);
      const r0 = Math.floor(Math.random() * rows);
      const cells = shape.map(([c, r]) => [c + c0, r + r0]);
      if (!fits(cells, rows)) continue;

      const tiles = cells.map(([c, r], index) => {
        taken.add(key(c, r));
        const tile = document.createElement("span");
        tile.className = styles.tile;
        tile.style.setProperty("--c", c);
        tile.style.setProperty("--r", r);
        tile.innerHTML = svgMarkup(Math.floor(Math.random() * DESIGNS.length));
        layer.appendChild(tile);
        later(() => tile.classList.add(styles.on), 40 + index * FLIP_STAGGER);
        return tile;
      });
      if (cluster) clusters += 1;
      else loners += 1;

      const [min, max] = cluster ? CLUSTER_HOLD : LONER_HOLD;
      const hold = min + Math.random() * (max - min);
      later(() => {
        tiles.forEach((tile, index) => later(() => tile.classList.remove(styles.on), index * FLIP_STAGGER));
        later(() => {
          tiles.forEach((tile) => tile.remove());
          cells.forEach(([c, r]) => taken.delete(key(c, r)));
          if (cluster) clusters -= 1;
          else loners -= 1;
        }, tiles.length * FLIP_STAGGER + 450);
      }, hold);
      return;
    }
  }

  function start() {
    if (running) return;
    running = true;
    root.dataset.live = "true";
    spawn(true);
    spawn(false);
    later(() => spawn(true), 250);
    later(() => spawn(false), 500);
    loop = setInterval(() => {
      if (clusters < MAX_CLUSTERS && Math.random() < 0.6) spawn(true);
      else if (loners < MAX_LONERS) spawn(false);
    }, SPAWN_EVERY);
  }

  function stop() {
    if (!running) return;
    running = false;
    clearInterval(loop);
    timers.forEach(clearTimeout);
    timers.clear();
    taken.clear();
    clusters = 0;
    loners = 0;
    layer.replaceChildren();
  }

  const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
  observer.observe(root);
  return () => {
    observer.disconnect();
    stop();
    delete root.dataset.live;
  };
}
