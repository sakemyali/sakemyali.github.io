import { useEffect, useState } from "react";

// Hand-drawn pixel mobs in the Minecraft style (original art, not game textures).
// Sprites are string grids: '.' empty, '#' body, 'o' dark features, 'w' light.

const SKELETON_FRAMES = [
  [
    // arms down, legs together
    "..########..",
    "..########..",
    "..#o####o#..",
    "..########..",
    "..###oo###..",
    "..########..",
    "..#.####.#..",
    "..#.####.#..",
    "..#.####.#..",
    "..#.####.#..",
    "..#.####.#..",
    "....####....",
    "....#..#....",
    "....#..#....",
    "....#..#....",
    "....#..#....",
    "....#..#....",
    "...##..##...",
  ],
  [
    // arms up, one-pixel bob, legs apart
    "............",
    "..########..",
    "..########..",
    "..#o####o#..",
    ".##########.",
    ".####oo####.",
    ".##########.",
    "..#.####.#..",
    "....####....",
    "....####....",
    "....####....",
    "....####....",
    "...#....#...",
    "...#....#...",
    "..#......#..",
    "..#......#..",
    "..#......#..",
    ".##......##.",
  ],
];

const WITHER_HEAD = [
  [
    ".######.",
    "########",
    "#ww##ww#",
    "########",
    "########",
    "#w#ww#w#",
    ".######.",
    "..####..",
  ],
];

function Sprite({ frames, palette, px = 3, fps = 2, className, label }) {
  const [f, setF] = useState(0);
  useEffect(() => {
    if (frames.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setF((v) => v + 1), 1000 / fps);
    return () => clearInterval(id);
  }, [frames.length, fps]);
  const rows = frames[f % frames.length];
  return (
    <svg
      width={rows[0].length * px}
      height={rows.length * px}
      shapeRendering="crispEdges"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {rows.map((row, y) =>
        [...row].map((c, x) =>
          palette[c] ? (
            <rect key={`${x},${y}`} x={x * px} y={y * px} width={px} height={px} fill={palette[c]} />
          ) : null
        )
      )}
    </svg>
  );
}

const BONE = { "#": "#cfcfcf", o: "#111111" };
const CHARCOAL = { "#": "#3f3f3f", o: "#0a0a0a" };

// Two skeletons flanking a (taller, darker) wither skeleton, all doing the
// same two-frame arms-up / arms-down dance in sync.
export function DancingSkeletons() {
  return (
    <div className="flex items-end gap-5" aria-hidden="true">
      <Sprite frames={SKELETON_FRAMES} palette={BONE} px={3} />
      <Sprite frames={SKELETON_FRAMES} palette={CHARCOAL} px={4} />
      <Sprite frames={SKELETON_FRAMES} palette={BONE} px={3} />
    </div>
  );
}

// Wither skull used as the "About" section name; label keeps it readable
// to screen readers.
export function WitherHead({ px = 2 }) {
  return (
    <Sprite
      frames={WITHER_HEAD}
      palette={{ "#": "#4a4a4a", w: "#e5e5e5" }}
      px={px}
      label="About"
      className="inline-block align-middle"
    />
  );
}
