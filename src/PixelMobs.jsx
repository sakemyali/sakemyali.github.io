import { useEffect, useState } from "react";

// Flat 2D mobs using the official Minecraft entity textures (public/mc/*.png,
// © Mojang — non-commercial fan use): each body part is a div cropping its
// FRONT face out of the texture atlas via background-position — the game's
// original 2D appearance. They just wander back and forth like in-game,
// with a rigid stepped walk cycle.

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
// Front-face crops for the skeleton family (slim 2x12x2 limbs)
const HEAD = { x: 8, y: 8, w: 8, h: 8 };
const BODY = { x: 20, y: 20, w: 8, h: 12 };
// the spine lives on the body's BACK face — in-game it shows through the
// front's transparent rows; in flat 2D we layer it behind at full strength
const BODY_BACK = { x: 32, y: 20, w: 8, h: 12 };
const ARM = { x: 42, y: 18, w: 2, h: 12 };
const LEG = { x: 2, y: 18, w: 2, h: 12 };

// Chibi build: the head renders at s*headScale while the body stays at s.
function SkeletonBody({ src, s, headScale = 1.35 }) {
  const s2 = s * headScale;
  const hs = 8 * s2;
  const W = Math.max(12 * s, hs);
  const H = hs + 22 * s; // legs tuck 2 texels up: the texture's pelvis rows
  const cx = W / 2;      // are transparent and read as a floating torso
  const t = { src, atlas: A32 };
  return (
    <div className="mc-walkbob" style={{ position: "relative", width: W, height: H }}>
      <Part {...t} {...ARM} s={s} className="mc-arm-l" style={{ left: cx - 6 * s, top: hs, transformOrigin: "50% 0" }} />
      <Part {...t} {...ARM} s={s} className="mc-arm-r" style={{ left: cx + 4 * s, top: hs, transformOrigin: "50% 0" }} />
      <Part {...t} {...LEG} s={s} className="mc-leg-l" style={{ left: cx - 3 * s, top: hs + 10 * s, transformOrigin: "50% 0" }} />
      <Part {...t} {...LEG} s={s} className="mc-leg-r" style={{ left: cx + 1 * s, top: hs + 10 * s, transformOrigin: "50% 0" }} />
      <Part {...t} {...BODY_BACK} s={s} style={{ left: cx - 4 * s, top: hs }} />
      <Part {...t} {...BODY} s={s} style={{ left: cx - 4 * s, top: hs }} />
      <Part {...t} {...HEAD} s={s2} className="mc-head" style={{ left: cx - hs / 2, top: 0, transformOrigin: "50% 100%" }} />
    </div>
  );
}

const MOBS = [
  { cls: "mob-a", src: "/mc/skeleton.png", s: 3, headScale: 1.35, home: 0 },
  { cls: "mob-w", src: "/mc/wither_skeleton.png", s: 4, headScale: 1.3, home: 70 },
  { cls: "mob-b", src: "/mc/skeleton.png", s: 3, headScale: 1.35, home: 150 },
  { cls: "mob-baby", src: "/mc/skeleton.png", s: 2, headScale: 1.5, home: 215, baby: true },
];

export function DancingSkeletons() {
  const [dx, setDx] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDx(70); // amble right, then back, forever
    const id = setInterval(() => setDx((d) => (d ? 0 : 70)), 4700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mcstage" aria-hidden="true"
         style={{ position: "relative", width: 320, height: 150 }}>
      {MOBS.map((m) => (
        <div key={m.cls} className={`mob ${m.cls}`}
             style={{
               position: "absolute", bottom: 0, left: m.home,
               transform: `translateX(${dx}px)`,
               transition: "transform 4.5s linear",
               transitionDelay: m.baby ? ".6s" : "0s", // the runt lags behind
             }}>
          <SkeletonBody src={m.src} s={m.s} headScale={m.headScale} />
        </div>
      ))}
      <style>{`
        /* faint glow lifts the thin bones off the dark background */
        .mcstage .mob { filter: drop-shadow(0 0 2px rgba(255,255,255,.16)); }
        /* Game-accurate walk: limbs swing forward/back (pitch), not sideways —
           HumanoidModel uses cos(limbSwing*0.6662), legs *1.4, arms opposite
           their same-side leg, all smooth cosine. Front-on that reads as
           foreshortening, so perspective+rotateX. Bob is per-footfall (2x). */
        .mcstage .mc-walkbob { animation: mc-walkbob .45s ease-in-out infinite; }
        .mcstage .mc-head { animation: mc-head 2.4s ease-in-out infinite; }
        .mcstage .mc-arm-l { animation: mc-swing-arm .9s ease-in-out infinite reverse; }
        .mcstage .mc-arm-r { animation: mc-swing-arm .9s ease-in-out infinite; }
        .mcstage .mc-leg-l { animation: mc-swing-leg .9s ease-in-out infinite; }
        .mcstage .mc-leg-r { animation: mc-swing-leg .9s ease-in-out infinite reverse; }
        @keyframes mc-walkbob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }
        @keyframes mc-head { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3deg) } }
        @keyframes mc-swing-leg { 0%,100% { transform: perspective(240px) rotateX(40deg) } 50% { transform: perspective(240px) rotateX(-40deg) } }
        @keyframes mc-swing-arm { 0%,100% { transform: perspective(240px) rotateX(28deg) } 50% { transform: perspective(240px) rotateX(-28deg) } }
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
