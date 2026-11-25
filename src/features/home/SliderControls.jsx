"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import styles from "./SliderControls.module.css";

/**
 * Prev / next buttons, a progress bar and mouse drag for a natively
 * scrolling track (overflow-x + scroll-snap). The track and its cards stay
 * Server Components: this island only gets the track's id. Touch swipe,
 * trackpad, Shift+wheel and Tab between the card links scroll it natively;
 * a mouse can grab and drag it (desktop only).
 *
 * @param {{ trackId: string, prevLabel: string, nextLabel: string, className?: string }} props
 */

const DRAG_THRESHOLD = 6; // px before a press becomes a drag (and not a click)
const FLICK = 40; // px of drag that moves to the next card on release

// Scroll positions at which each card sits on the track's snap edge.
// Measured from the rendered cards; the snap edge is the track's left
// padding (scroll-padding mirrors it).
function snapStops(track) {
  const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
  const trackLeft = track.getBoundingClientRect().left;
  const max = track.scrollWidth - track.clientWidth;
  return Array.from(track.children).map((card) =>
    Math.min(max, Math.max(0, card.getBoundingClientRect().left - trackLeft + track.scrollLeft - padding)),
  );
}

function nearestIndex(stops, position) {
  let best = 0;
  stops.forEach((stop, index) => {
    if (Math.abs(stop - position) < Math.abs(stops[best] - position)) best = index;
  });
  return best;
}

const behavior = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

export default function SliderControls({ trackId, prevLabel, nextLabel, className }) {
  const barRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const getTrack = useCallback(() => document.getElementById(trackId), [trackId]);

  // Progress bar + disabled arrows at either end.
  useEffect(() => {
    const track = getTrack();
    if (!track) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = track.scrollWidth - track.clientWidth;
      const left = track.scrollLeft;
      const ratio = max > 0 ? left / max : 1;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0.08, ratio)})`;
      const next = { start: left <= 2, end: left >= max - 2 };
      setEdges((prev) => (prev.start === next.start && prev.end === next.end ? prev : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [getTrack]);

  // Mouse drag (pointer type "mouse" only — touch and pen scroll natively).
  // Pointer moves only record where the track should be; one rAF per frame
  // writes scrollLeft, so the drag is frame-aligned (no double writes or
  // skipped frames on high-rate mice). Snapping and the cards' hover
  // effects are off while dragging; on release the track glides to the
  // card the drag points at.
  useEffect(() => {
    const track = getTrack();
    if (!track) return undefined;
    let press = null;
    let dragged = false;
    let target = 0;
    let frame = 0;
    let settleId = 0;

    const apply = () => {
      frame = 0;
      track.scrollLeft = target;
    };

    const settle = (left) => {
      const id = ++settleId;
      track.scrollTo({ left, behavior: behavior() });
      let timer = 0;
      const restore = () => {
        track.removeEventListener("scrollend", restore);
        clearTimeout(timer);
        // A new drag may have started meanwhile: leave its state alone.
        if (id === settleId && !press) delete track.dataset.dragging;
      };
      track.addEventListener("scrollend", restore);
      timer = setTimeout(restore, 700);
    };

    const onDown = (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      settleId += 1; // cancel a pending snap restore from the previous drag
      press = { x: event.clientX, left: track.scrollLeft, id: event.pointerId };
      dragged = false;
    };
    const onMove = (event) => {
      if (!press || event.pointerId !== press.id) return;
      const dx = event.clientX - press.x;
      if (!dragged && Math.abs(dx) < DRAG_THRESHOLD) return;
      if (!dragged) {
        dragged = true;
        track.dataset.dragging = "";
        track.setPointerCapture(press.id);
      }
      target = press.left - dx;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onUp = (event) => {
      if (!press || event.pointerId !== press.id) return;
      const start = press.left;
      press = null;
      if (!dragged) return;
      if (frame) {
        cancelAnimationFrame(frame);
        apply();
      }
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      const stops = snapStops(track);
      const moved = track.scrollLeft - start;
      let index = nearestIndex(stops, track.scrollLeft);
      if (Math.abs(moved) > FLICK && index === nearestIndex(stops, start)) {
        index = Math.min(stops.length - 1, Math.max(0, index + Math.sign(moved)));
      }
      settle(stops[index]);
    };
    // A drag must not also follow the card link it started on.
    const onClick = (event) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    };
    // No text selection (its autoscroll fights the drag) and no native
    // link / image drag-and-drop.
    const onMouseDown = (event) => {
      if (event.button === 0) event.preventDefault();
    };
    const onDragStart = (event) => event.preventDefault();

    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    track.addEventListener("click", onClick, true);
    track.addEventListener("mousedown", onMouseDown);
    track.addEventListener("dragstart", onDragStart);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
      track.removeEventListener("click", onClick, true);
      track.removeEventListener("mousedown", onMouseDown);
      track.removeEventListener("dragstart", onDragStart);
      delete track.dataset.dragging;
    };
  }, [getTrack]);

  // Arrows: one card back / forward from the card currently on the edge.
  const step = (direction) => {
    const track = getTrack();
    if (!track) return;
    const stops = snapStops(track);
    const index = nearestIndex(stops, track.scrollLeft);
    const target = stops[Math.min(stops.length - 1, Math.max(0, index + direction))];
    track.scrollTo({ left: target, behavior: behavior() });
  };

  return (
    <div className={[styles.controls, className].filter(Boolean).join(" ")}>
      <span className={styles.progress} aria-hidden="true">
        <span ref={barRef} />
      </span>
      <button
        type="button"
        className={styles.button}
        aria-controls={trackId}
        aria-label={prevLabel}
        disabled={edges.start}
        onClick={() => step(-1)}
      >
        <Icon name="arrow" size={18} className={styles.back} />
      </button>
      <button
        type="button"
        className={styles.button}
        aria-controls={trackId}
        aria-label={nextLabel}
        disabled={edges.end}
        onClick={() => step(1)}
      >
        <Icon name="arrow" size={18} />
      </button>
    </div>
  );
}
