import { FLAG_DESIGNS } from "./flagDesigns";
import styles from "./FlagWall.module.css";

/**
 * A full wall of signal flags on modra, tilted 30°, where every tile is a
 * two-sided card: a diagonal wave turns them over one after another to
 * show the flag on the back, then back again (one round every 9s).
 *
 * Pure CSS, so it renders on the server. The layout is seeded, so the same
 * `seed` (e.g. a post id) always gives the same wall and server and client
 * markup match. Fills its positioned parent; the grid is sized to cover a
 * full-width hero at any screen size, and the parent clips the rest.
 * Reduced motion: the wall stands still. Decorative, so aria-hidden.
 *
 * @param {{ seed?: string | number, className?: string }} props
 */

const COLS = 10;
const ROWS = 7;
const WAVE_STEP = 0.55; // s between neighbouring diagonals
const JITTER = 1.2; // s of random offset per tile

export default function FlagWall({ seed = 1, className }) {
  const random = seededRandom(seed);
  const pick = () => Math.floor(random() * FLAG_DESIGNS.length);

  const tiles = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const front = pick();
      let back = pick();
      if (back === front) back = (back + 1) % FLAG_DESIGNS.length;
      const delay = -((col + row) * WAVE_STEP + random() * JITTER);
      tiles.push({ col, row, front, back, delay: `${delay.toFixed(2)}s` });
    }
  }

  return (
    <span className={[styles.wall, className].filter(Boolean).join(" ")} aria-hidden="true">
      <span className={styles.grid} style={{ "--cols": COLS, "--rows": ROWS }}>
        {tiles.map((tile) => (
          <span key={`${tile.col}-${tile.row}`} className={styles.tile} style={{ "--c": tile.col, "--r": tile.row }}>
            <span className={styles.card} style={{ animationDelay: tile.delay }}>
              <span className={styles.face}>
                <Flag design={tile.front} />
              </span>
              <span className={`${styles.face} ${styles.back}`}>
                <Flag design={tile.back} />
              </span>
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

function Flag({ design }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
      {FLAG_DESIGNS[design].map(([type, ...rest], index) => {
        const className = styles[rest[rest.length - 1]];
        if (type === "rect") {
          const [x, y, width, height] = rest;
          return <rect key={index} className={className} x={x} y={y} width={width} height={height} />;
        }
        if (type === "circle") {
          const [cx, cy, r] = rest;
          return <circle key={index} className={className} cx={cx} cy={cy} r={r} />;
        }
        return <polygon key={index} className={className} points={rest[0]} />;
      })}
    </svg>
  );
}

// mulberry32, seeded from a number or a string (FNV-1a).
function seededRandom(seed) {
  let state = typeof seed === "number" ? seed : hash(String(seed));
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
