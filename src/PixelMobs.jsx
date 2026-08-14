import { useEffect, useState } from "react";

// Flat 2D pixel skeletons, hand-drawn to match the dithered monochrome smoke
// background (original art). Parts are string grids rendered as SVG rects;
// limbs animate with the same CSS choreography as before. Each page load
// picks ONE scene at random — dance, patrol, or bow duel — and loops it.

// grid chars: '#' bone, '+' dither shade, 'o' dark, 'w' light, '.' empty
const HEAD_G = [
  "########",
  "#+####+#",
  "#oo##oo#",
  "########",
  "###oo###",
  "#+o##o+#",
  "########",
  "+######+",
];
const BODY_G = [
  "########",
  "#o#oo#o#",
  "########",
  "#o#oo#o#",
  "########",
  "#o#oo#o#",
  "+##++##+",
  "..#++#..",
  "..#++#..",
  "..####..",
  ".######.",
  "#+####+#",
];
const ARM_G = ["##", "#+", "##", "##", "+#", "oo", "##", "##", "#+", "##", "##", "++"];
const LEG_G = ["##", "+#", "##", "##", "#+", "oo", "##", "##", "+#", "##", "##", "##"];
const WSKULL_G = [
  ".######.",
  "########",
  "#ww##ww#",
  "########",
  "##+##+##",
  "#w#ww#w#",
  ".######.",
  "..####..",
];

const BONE = { "#": "#e6e6e6", "+": "#9e9e9e", o: "#161616" };
const DARK = { "#": "#4a4a4a", "+": "#303030", o: "#101010" };
const WSKULL = { "#": "#3f3f3f", "+": "#262626", w: "#e8e8e8" };

function PixelPart({ grid, pal, s, className, style }) {
  return (
    <svg width={grid[0].length * s} height={grid.length * s} shapeRendering="crispEdges"
         className={className} style={{ position: "absolute", ...style }}>
      {grid.map((row, y) =>
        [...row].map((c, x) =>
          pal[c] ? <rect key={`${x},${y}`} x={x * s} y={y * s} width={s} height={s} fill={pal[c]} /> : null
        )
      )}
    </svg>
  );
}

// Chibi build: the head renders at s*headScale while the body stays at s.
function SkeletonBody({ pal, s, headScale = 1.35 }) {
  const s2 = s * headScale;
  const hs = 8 * s2;
  const W = Math.max(12 * s, hs);
  const H = hs + 22 * s; // legs tuck 2 texels up under the pelvis
  const cx = W / 2;
  return (
    <div className="mc-bob" style={{ position: "relative", width: W, height: H }}>
      <PixelPart grid={ARM_G} pal={pal} s={s} className="mc-arm-l" style={{ left: cx - 6 * s, top: hs, transformOrigin: "50% 0" }} />
      <PixelPart grid={ARM_G} pal={pal} s={s} className="mc-arm-r" style={{ left: cx + 4 * s, top: hs, transformOrigin: "50% 0" }} />
      <PixelPart grid={LEG_G} pal={pal} s={s} className="mc-leg-l" style={{ left: cx - 3 * s, top: hs + 10 * s, transformOrigin: "50% 0" }} />
      <PixelPart grid={LEG_G} pal={pal} s={s} className="mc-leg-r" style={{ left: cx + 1 * s, top: hs + 10 * s, transformOrigin: "50% 0" }} />
      <PixelPart grid={BODY_G} pal={pal} s={s} style={{ left: cx - 4 * s, top: hs }} />
      <PixelPart grid={HEAD_G} pal={pal} s={s2} className="mc-head" style={{ left: cx - hs / 2, top: 0, transformOrigin: "50% 100%" }} />
      {/* blush */}
      {[cx - hs / 2 + 1 * s2, cx + hs / 2 - 2 * s2].map((left) => (
        <div key={left} style={{
          position: "absolute", left, top: 5.2 * s2, width: s2, height: 0.7 * s2,
          background: "#ff9fb0", opacity: 0.55, borderRadius: "40%",
        }} />
      ))}
    </div>
  );
}

const MOBS = [
  { cls: "mob-a", pal: BONE, s: 3, headScale: 1.35, home: 0 },
  { cls: "mob-w", pal: DARK, s: 4, headScale: 1.3, home: 70 },
  { cls: "mob-b", pal: BONE, s: 3, headScale: 1.35, home: 150 },
  { cls: "mob-baby", pal: BONE, s: 2, headScale: 1.5, home: 215, baby: true },
];

const SCENES = ["dance", "walk", "fight"];

export function DancingSkeletons() {
  // one random scene per page load, looped forever (?mob=dance|walk|fight forces one)
  const [scene] = useState(() =>
    new URLSearchParams(location.search).get("mob") || SCENES[Math.floor(Math.random() * SCENES.length)]);
  const [dx, setDx] = useState(0);
  useEffect(() => {
    if (scene !== "walk" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDx(70); // amble right, then back, forever
    const id = setInterval(() => setDx((d) => (d ? 0 : 70)), 4700);
    return () => clearInterval(id);
  }, [scene]);

  return (
    <div className={`mcstage ph-${scene}`} aria-hidden="true"
         style={{ position: "relative", width: 320, height: 150 }}>
      {MOBS.map((m) => (
        <div key={m.cls} className={`mob ${m.cls}`}
             style={{
               position: "absolute", bottom: 0, left: m.home,
               transform: `translateX(${dx}px)`,
               transition: "transform 4.5s linear",
               transitionDelay: m.baby ? ".6s" : "0s", // the runt lags behind
             }}>
          <div className="mc-hurtwrap" style={{ transformOrigin: "50% 100%", transition: "transform .3s" }}>
            <SkeletonBody pal={m.pal} s={m.s} headScale={m.headScale} />
          </div>
        </div>
      ))}
      <div className="mc-arrow mc-arrow-1" />
      <div className="mc-arrow mc-arrow-2" />
      {[[26, 0], [100, 1.2], [176, 2.4]].map(([left, delay]) => (
        <span key={left} className="mc-heart"
              style={{ left, bottom: 118, animationDelay: `${delay}s` }}>♥</span>
      ))}
      <style>{`
        /* faint glow lifts the thin bones off the dark background */
        .mcstage .mob { filter: drop-shadow(0 0 2px rgba(255,255,255,.16)); }
        .mcstage .mc-bob { animation: mc-bob 1.2s ease-in-out infinite; transform-origin: 50% 100%; }
        .mcstage .mob-baby .mc-bob { animation-duration: .9s; }
        .mcstage .mc-head { animation: mc-head 2.4s ease-in-out infinite; }
        .mcstage .mc-arm-l { animation: mc-arm-l 1.2s ease-in-out infinite; }
        .mcstage .mc-arm-r { animation: mc-arm-r 1.2s ease-in-out infinite; }
        .mcstage .mc-leg-l { animation: mc-step 1.2s ease-in-out infinite; }
        .mcstage .mc-leg-r { animation: mc-step 1.2s ease-in-out infinite reverse; }
        @keyframes mc-bob { 0%,100% { transform: translateY(0) scaleY(1) } 35% { transform: translateY(-3px) scaleY(1.04) } 70% { transform: translateY(1px) scaleY(.96) } }
        @keyframes mc-head { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(8deg) } }
        /* wave caps at ~168deg: past vertical the arm sweeps inward through
           the (oversized chibi) head */
        @keyframes mc-arm-l { 0%,100% { transform: rotate(132deg) } 50% { transform: rotate(168deg) } }
        @keyframes mc-arm-r { 0%,100% { transform: rotate(-132deg) } 50% { transform: rotate(-168deg) } }
        @keyframes mc-step { 0%,100% { transform: rotate(-6deg) } 50% { transform: rotate(6deg) } }

        /* patrol: arms drop and swing, legs stride, no bounce */
        .ph-walk .mc-bob { animation: none; }
        .ph-walk .mc-arm-l { animation: mc-stride .9s ease-in-out infinite; }
        .ph-walk .mc-arm-r { animation: mc-stride .9s ease-in-out infinite reverse; }
        .ph-walk .mc-leg-l { animation: mc-stride .9s ease-in-out infinite reverse; }
        .ph-walk .mc-leg-r { animation: mc-stride .9s ease-in-out infinite; }
        @keyframes mc-stride { 0%,100% { transform: rotate(20deg) } 50% { transform: rotate(-20deg) } }

        /* bow duel (loops): outer skeletons aim at each other, arrows fly,
           hurt-flash + knockback on hit; the wither ducks; the baby dances on */
        .ph-fight .mob-a .mc-arm-r,
        .ph-fight .mob-b .mc-arm-l { animation: none; }
        .ph-fight .mob-a .mc-arm-r { transform: rotate(-90deg); }
        .ph-fight .mob-b .mc-arm-l { transform: rotate(90deg); }
        .ph-fight .mob-a { animation: mc-hurt-a 5.5s linear infinite; }
        .ph-fight .mob-b { animation: mc-hurt-b 5.5s linear infinite; }
        .ph-fight .mob-w .mc-hurtwrap { transform: translateY(14px) scaleY(.88); }
        @keyframes mc-hurt-b { 0%,39% { filter: drop-shadow(0 0 2px rgba(255,255,255,.16)); transform: none } 41%,52% { filter: sepia(1) saturate(7) hue-rotate(-55deg) brightness(1.1); transform: translateX(9px) } 56%,100% { filter: drop-shadow(0 0 2px rgba(255,255,255,.16)); transform: none } }
        @keyframes mc-hurt-a { 0%,61% { filter: drop-shadow(0 0 2px rgba(255,255,255,.16)); transform: none } 63%,74% { filter: sepia(1) saturate(7) hue-rotate(-55deg) brightness(1.1); transform: translateX(-9px) } 78%,100% { filter: drop-shadow(0 0 2px rgba(255,255,255,.16)); transform: none } }
        .mc-arrow { position: absolute; width: 12px; height: 3px; background: #cfcfcf; bottom: 64px; opacity: 0; }
        .ph-fight .mc-arrow-1 { left: 34px; animation: mc-fly1 5.5s linear infinite; }
        .ph-fight .mc-arrow-2 { left: 160px; animation: mc-fly2 5.5s linear infinite; }
        @keyframes mc-fly1 { 0%,26% { opacity: 0; transform: translateX(0) } 28% { opacity: 1 } 40% { opacity: 1; transform: translateX(128px) } 41%,100% { opacity: 0; transform: translateX(128px) } }
        @keyframes mc-fly2 { 0%,48% { opacity: 0; transform: translateX(0) } 50% { opacity: 1 } 62% { opacity: 1; transform: translateX(-128px) } 63%,100% { opacity: 0; transform: translateX(-128px) } }

        /* hearts while dancing */
        .mc-heart { position: absolute; font-size: 11px; color: #ff8fb3; opacity: 0; }
        .ph-dance .mc-heart { animation: mc-heart 3.6s ease-out infinite; }
        @keyframes mc-heart { 0% { opacity: 0; transform: translateY(0) } 15% { opacity: .9 } 100% { opacity: 0; transform: translateY(-24px) } }

        @media (prefers-reduced-motion: reduce) {
          .mcstage *, .mcstage .mc-bob { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

// Flat 2D wither skull, used as the "About" section name.
export function WitherHead({ px = 2 }) {
  return (
    <span role="img" aria-label="About"
          style={{ display: "inline-block", verticalAlign: "middle", position: "relative", width: 8 * px, height: 8 * px }}>
      <PixelPart grid={WSKULL_G} pal={WSKULL} s={px} style={{ left: 0, top: 0 }} />
    </span>
  );
}
