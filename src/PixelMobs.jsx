import { useEffect, useState } from "react";

// Flat 2D mobs in PROFILE view using the official Minecraft entity textures
// (public/mc/*.png, © Mojang — non-commercial fan use). Side view is how 2D
// renditions of Minecraft (Paper Minecraft etc.) show the walk: limbs pivot
// at the hip/shoulder and scissor forward-back, which in profile is a plain
// screen-plane rotation — the game's cos-wave walk, legs swinging wider than
// arms, each arm counter-phased to its same-side leg. Far limbs are dimmed.

function Part({ src, atlas, x, y, w, h, s, className, style }) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: w * s,
        height: h * s,
        backgroundImage: `url(${src})`,
        backgroundPosition: `${-x * s}px ${-y * s}px`,
        backgroundSize: `${atlas[0] * s}px ${atlas[1] * s}px`,
        imageRendering: "pixelated",
        ...style,
      }}
    />
  );
}

const A32 = [64, 32];
// Side-face crops for the skeleton family (right-facing profile)
const HEAD_SIDE = { x: 0, y: 8, w: 8, h: 8 };
const BODY_SIDE = { x: 16, y: 20, w: 4, h: 12 };
const ARM_SIDE = { x: 40, y: 18, w: 2, h: 12 };
const LEG_SIDE = { x: 0, y: 18, w: 2, h: 12 };

// Chibi build: the head renders at s*headScale while the body stays at s.
function SkeletonBody({ src, s, headScale = 1.35 }) {
  const s2 = s * headScale;
  const hs = 8 * s2;
  const W = Math.max(8 * s, hs);
  const H = hs + 22 * s; // legs tuck 2 texels up under the pelvis
  const cx = W / 2;
  const t = { src, atlas: A32 };
  const dim = { filter: "brightness(.55)" };
  return (
    <div className="mc-walkbob" style={{ position: "relative", width: W, height: H }}>
      {/* far limbs first, dimmed, counter-phased to the near ones */}
      <Part {...t} {...ARM_SIDE} s={s} className="mc-limb-far-arm"
            style={{ left: cx - s, top: hs, transformOrigin: "50% 0", ...dim }} />
      <Part {...t} {...LEG_SIDE} s={s} className="mc-limb-far-leg"
            style={{ left: cx - s, top: hs + 10 * s, transformOrigin: "50% 0", ...dim }} />
      <Part {...t} {...BODY_SIDE} s={s} style={{ left: cx - 2 * s, top: hs }} />
      <Part {...t} {...LEG_SIDE} s={s} className="mc-limb-leg"
            style={{ left: cx - s, top: hs + 10 * s, transformOrigin: "50% 0" }} />
      <Part {...t} {...ARM_SIDE} s={s} className="mc-limb-arm"
            style={{ left: cx - s, top: hs, transformOrigin: "50% 0" }} />
      <Part {...t} {...HEAD_SIDE} s={s2} className="mc-head"
            style={{ left: cx - hs / 2, top: 0, transformOrigin: "50% 100%" }} />
    </div>
  );
}

const MOBS = [
  { cls: "mob-a", src: "/mc/skeleton.png", s: 3, headScale: 1.35, home: 10 },
  { cls: "mob-w", src: "/mc/wither_skeleton.png", s: 4, headScale: 1.3, home: 80 },
  { cls: "mob-b", src: "/mc/skeleton.png", s: 3, headScale: 1.35, home: 150 },
  { cls: "mob-baby", src: "/mc/skeleton.png", s: 2, headScale: 1.5, home: 210, baby: true },
];

export function DancingSkeletons() {
  const [dx, setDx] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDx(110); // amble right, turn, amble back, forever
    const id = setInterval(() => setDx((d) => (d ? 0 : 110)), 4700);
    return () => clearInterval(id);
  }, []);
  const facing = dx ? 1 : -1; // profile flips to match travel direction

  return (
    <div className="mcstage" aria-hidden="true"
         style={{ position: "relative", width: 360, height: 150 }}>
      {MOBS.map((m) => (
        <div key={m.cls} className={`mob ${m.cls}`}
             style={{
               position: "absolute", bottom: 0, left: m.home,
               transform: `translateX(${dx}px)`,
               transition: "transform 4.5s linear",
               transitionDelay: m.baby ? ".6s" : "0s", // the runt lags behind
             }}>
          <div style={{ transform: `scaleX(${facing})`, transition: "transform .25s" }}>
            <SkeletonBody src={m.src} s={m.s} headScale={m.headScale} />
          </div>
        </div>
      ))}
      <style>{`
        /* faint glow lifts the thin bones off the dark background */
        .mcstage .mob { filter: drop-shadow(0 0 2px rgba(255,255,255,.16)); }
        /* game walk in profile: smooth cosine, legs +-40deg, arms +-28deg,
           arms counter-phased to same-side legs, small bob per footfall */
        .mcstage .mc-walkbob { animation: mc-walkbob .45s ease-in-out infinite; }
        .mcstage .mc-head { animation: mc-head 2.4s ease-in-out infinite; }
        .mcstage .mc-limb-arm { animation: mc-swing-arm .75s ease-in-out infinite; }
        .mcstage .mc-limb-far-arm { animation: mc-swing-arm .75s ease-in-out infinite reverse; }
        .mcstage .mc-limb-leg { animation: mc-swing-leg .75s ease-in-out infinite reverse; }
        .mcstage .mc-limb-far-leg { animation: mc-swing-leg .75s ease-in-out infinite; }
        @keyframes mc-walkbob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }
        @keyframes mc-head { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3deg) } }
        @keyframes mc-swing-leg { 0%,100% { transform: rotate(18deg) } 50% { transform: rotate(-18deg) } }
        @keyframes mc-swing-arm { 0%,100% { transform: rotate(12deg) } 50% { transform: rotate(-12deg) } }
        @media (prefers-reduced-motion: reduce) {
          .mcstage * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

// Wither boss center head, flat front face (8x8 at (8,8) in the 64x64 atlas),
// used as the "About" section name.
export function WitherHead({ px = 2 }) {
  return (
    <span role="img" aria-label="About"
          style={{ display: "inline-block", verticalAlign: "middle", position: "relative", width: 8 * px, height: 8 * px }}>
      <Part src="/mc/wither.png" atlas={[64, 64]} x={8} y={8} w={8} h={8} s={px} style={{ left: 0, top: 0 }} />
    </span>
  );
}
