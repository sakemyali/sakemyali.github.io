import { useEffect, useState } from "react";

// Mobs assembled from the official Minecraft entity texture atlases
// (public/mc/*.png, © Mojang — non-commercial fan use). Each body part is a
// real CSS-3D box: front/left/right/top faces cropped from its UV block,
// sides shaded, whole mob tilted into a 3/4 view. A phase timeline cycles
// dance → walk → dance → bow duel → walk home.

// One textured box. (u,v) = UV block origin, (w,h,d) = box dims in texels.
// Faces per MC layout: top (u+d,v), front (u+d,v+d), sides flanking front.
function Box({ src, atlas, u, v, w, h, d, s, className, style }) {
  const D = d * s;
  const face = (cx, cy, cw, ch, transform, bright) => (
    <div key={transform} style={{
      position: "absolute", left: 0, top: 0,
      width: cw * s, height: ch * s,
      backgroundImage: `url(${src})`,
      backgroundPosition: `${-cx * s}px ${-cy * s}px`,
      backgroundSize: `${atlas[0] * s}px ${atlas[1] * s}px`,
      imageRendering: "pixelated",
      transformOrigin: "0 0",
      transform,
      backfaceVisibility: "hidden",
      filter: `brightness(${bright})`,
    }} />
  );
  return (
    <div className={className}
         style={{ position: "absolute", width: w * s, height: h * s, transformStyle: "preserve-3d", ...style }}>
      {/* inner shell centers the box's depth on its layout plane, so limb
          rotation animations on the outer div don't wipe the centering */}
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateZ(${-D / 2}px)` }}>
        {face(u + d, v + d, w, h, `translateZ(${D}px)`, 1)}
        {face(u, v + d, d, h, "rotateY(-90deg)", 0.72)}
        {face(u + d + w, v + d, d, h, `translate3d(${w * s}px,0,${D}px) rotateY(90deg)`, 0.72)}
        {face(u + d, v, w, d, "rotateX(90deg)", 1.15)}
      </div>
    </div>
  );
}

const A32 = [64, 32];
// UV block origins + dims for the skeleton family (slim 2x12x2 limbs)
const HEAD = { u: 0, v: 0, w: 8, h: 8, d: 8 };
const BODY = { u: 16, v: 16, w: 8, h: 12, d: 4 };
const ARM = { u: 40, v: 16, w: 2, h: 12, d: 2 };
const LEG = { u: 0, v: 16, w: 2, h: 12, d: 2 };

// Chibi build: the head renders at s*headScale while the body stays at s.
function SkeletonBody({ src, s, headScale = 1.6 }) {
  const s2 = s * headScale;
  const hs = 8 * s2;
  const W = Math.max(12 * s, hs);
  const H = hs + 24 * s;
  const cx = W / 2;
  const t = { src, atlas: A32 };
  return (
    <div className="mc-bob" style={{ position: "relative", width: W, height: H, transformStyle: "preserve-3d" }}>
      <Box {...t} {...ARM} s={s} className="mc-arm-l" style={{ left: cx - 6 * s, top: hs, transformOrigin: "50% 0" }} />
      <Box {...t} {...ARM} s={s} className="mc-arm-r" style={{ left: cx + 4 * s, top: hs, transformOrigin: "50% 0" }} />
      <Box {...t} {...LEG} s={s} className="mc-leg-l" style={{ left: cx - 2 * s, top: hs + 12 * s, transformOrigin: "50% 0" }} />
      <Box {...t} {...LEG} s={s} className="mc-leg-r" style={{ left: cx, top: hs + 12 * s, transformOrigin: "50% 0" }} />
      <Box {...t} {...BODY} s={s} style={{ left: cx - 4 * s, top: hs }} />
      <Box {...t} {...HEAD} s={s2} className="mc-head" style={{ left: cx - hs / 2, top: 0, transformOrigin: "50% 100%" }} />
      {/* blush, floated just in front of the head's front face */}
      {[cx - hs / 2 + 1 * s2, cx + hs / 2 - 2 * s2].map((left) => (
        <div key={left} style={{
          position: "absolute", left, top: 5.2 * s2, width: s2, height: 0.7 * s2,
          background: "#ff9fb0", opacity: 0.55, borderRadius: "40%",
          transform: `translateZ(${4 * s2 + 1}px)`,
        }} />
      ))}
    </div>
  );
}

const MOBS = [
  { cls: "mob-a", src: "/mc/skeleton.png", s: 3, headScale: 1.6, home: 6 },
  { cls: "mob-w", src: "/mc/wither_skeleton.png", s: 4, headScale: 1.5, home: 64 },
  { cls: "mob-b", src: "/mc/skeleton.png", s: 3, headScale: 1.6, home: 140 },
  { cls: "mob-baby", src: "/mc/skeleton.png", s: 2, headScale: 1.8, home: 200, baby: true },
];

const TIMELINE = [
  ["dance", 3600],
  ["walk", 2600],
  ["dance", 2600],
  ["fight", 3200],
  ["walk-home", 2600],
];

export function DancingSkeletons() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setStep((step + 1) % TIMELINE.length), TIMELINE[step][1]);
    return () => clearTimeout(id);
  }, [step]);
  const phase = TIMELINE[step][0];
  const mode = phase.startsWith("walk") ? "walk" : phase;
  const dx = step >= 1 && step <= 3 ? 55 : 0; // group patrols right, then home

  return (
    <div className={`mcstage ph-${mode}`} aria-hidden="true"
         style={{ position: "relative", width: 300, height: 156 }}>
      {MOBS.map((m) => (
        <div key={m.cls} className={`mob ${m.cls}`}
             style={{
               position: "absolute", bottom: 0, left: m.home,
               transform: `translateX(${dx}px)`,
               transition: "transform 2.4s linear",
               transitionDelay: m.baby ? ".4s" : "0s", // the runt lags behind
             }}>
          {/* 3/4-view tilt: shows front + right side + top of every box */}
          <div style={{ transform: "perspective(600px) rotateX(-12deg) rotateY(-30deg)", transformStyle: "preserve-3d" }}>
            <div className="mc-hurtwrap"
                 style={{ transformOrigin: "50% 100%", transition: "transform .3s", transformStyle: "preserve-3d" }}>
              <SkeletonBody src={m.src} s={m.s} headScale={m.headScale} />
            </div>
          </div>
        </div>
      ))}
      <div className="mc-arrow mc-arrow-1" />
      <div className="mc-arrow mc-arrow-2" />
      {[[26, 0], [96, 0.8], [168, 1.6]].map(([left, delay]) => (
        <span key={left} className="mc-heart"
              style={{ left, bottom: 120, animationDelay: `${delay}s` }}>♥</span>
      ))}
      <style>{`
        .mcstage .mc-bob { animation: mc-bob .6s ease-in-out infinite; transform-origin: 50% 100%; }
        .mcstage .mob-baby .mc-bob { animation-duration: .45s; }
        .mcstage .mc-head { animation: mc-head 1.2s ease-in-out infinite; }
        .mcstage .mc-arm-l { animation: mc-arm-l .6s ease-in-out infinite; }
        .mcstage .mc-arm-r { animation: mc-arm-r .6s ease-in-out infinite; }
        .mcstage .mc-leg-l { animation: mc-step .6s ease-in-out infinite; }
        .mcstage .mc-leg-r { animation: mc-step .6s ease-in-out infinite reverse; }
        @keyframes mc-bob { 0%,100% { transform: translateY(0) scaleY(1) } 35% { transform: translateY(-4px) scaleY(1.05) } 70% { transform: translateY(1px) scaleY(.94) } }
        @keyframes mc-head { 0%,100% { transform: rotate(-9deg) } 50% { transform: rotate(9deg) } }
        @keyframes mc-arm-l { 0%,100% { transform: rotate(150deg) } 50% { transform: rotate(205deg) } }
        @keyframes mc-arm-r { 0%,100% { transform: rotate(-150deg) } 50% { transform: rotate(-205deg) } }
        @keyframes mc-step { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(8deg) } }

        /* walk cycle: arms drop and swing, legs stride, no bounce */
        .ph-walk .mc-bob { animation: none; }
        .ph-walk .mc-arm-l { animation: mc-stride .5s ease-in-out infinite; }
        .ph-walk .mc-arm-r { animation: mc-stride .5s ease-in-out infinite reverse; }
        .ph-walk .mc-leg-l { animation: mc-stride .5s ease-in-out infinite reverse; }
        .ph-walk .mc-leg-r { animation: mc-stride .5s ease-in-out infinite; }
        @keyframes mc-stride { 0%,100% { transform: rotate(22deg) } 50% { transform: rotate(-22deg) } }

        /* bow duel: outer skeletons aim at each other, arrows fly, hurt-flash
           + knockback on hit; the wither ducks; the baby dances on oblivious */
        .ph-fight .mob-a .mc-arm-r,
        .ph-fight .mob-b .mc-arm-l { animation: none; }
        .ph-fight .mob-a .mc-arm-r { transform: rotate(-90deg); }
        .ph-fight .mob-b .mc-arm-l { transform: rotate(90deg); }
        .ph-fight .mob-a .mc-hurtwrap { animation: mc-hurt-a 3.2s linear; }
        .ph-fight .mob-b .mc-hurtwrap { animation: mc-hurt-b 3.2s linear; }
        .ph-fight .mob-w .mc-hurtwrap { transform: translateY(14px) scaleY(.88); }
        @keyframes mc-hurt-b { 0%,39% { filter: none; transform: none } 41%,52% { filter: sepia(1) saturate(7) hue-rotate(-55deg) brightness(1.1); transform: translateX(9px) } 56%,100% { filter: none; transform: none } }
        @keyframes mc-hurt-a { 0%,61% { filter: none; transform: none } 63%,74% { filter: sepia(1) saturate(7) hue-rotate(-55deg) brightness(1.1); transform: translateX(-9px) } 78%,100% { filter: none; transform: none } }
        .mc-arrow { position: absolute; width: 12px; height: 3px; background: #cfcfcf; bottom: 64px; opacity: 0; }
        .ph-fight .mc-arrow-1 { left: 34px; animation: mc-fly1 3.2s linear; }
        .ph-fight .mc-arrow-2 { left: 150px; animation: mc-fly2 3.2s linear; }
        @keyframes mc-fly1 { 0%,27% { opacity: 0; transform: translateX(0) } 28% { opacity: 1 } 40% { opacity: 1; transform: translateX(118px) } 41%,100% { opacity: 0; transform: translateX(118px) } }
        @keyframes mc-fly2 { 0%,49% { opacity: 0; transform: translateX(0) } 50% { opacity: 1 } 62% { opacity: 1; transform: translateX(-118px) } 63%,100% { opacity: 0; transform: translateX(-118px) } }

        /* hearts while dancing */
        .mc-heart { position: absolute; font-size: 11px; color: #ff8fb3; opacity: 0; }
        .ph-dance .mc-heart { animation: mc-heart 2.4s ease-out infinite; }
        @keyframes mc-heart { 0% { opacity: 0; transform: translateY(0) } 15% { opacity: .9 } 100% { opacity: 0; transform: translateY(-24px) } }

        @media (prefers-reduced-motion: reduce) {
          .mcstage *, .mcstage .mc-bob { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

// Wither boss center head as a tiny 3D cube, used as the "About" label.
export function WitherHead({ px = 2 }) {
  return (
    <span role="img" aria-label="About"
          style={{ display: "inline-block", verticalAlign: "middle", width: 10 * px, height: 9 * px }}>
      <span style={{
        position: "relative", display: "block", width: 8 * px, height: 8 * px,
        transform: "perspective(200px) rotateX(-14deg) rotateY(-28deg)",
        transformStyle: "preserve-3d",
      }}>
        <Box src="/mc/wither.png" atlas={[64, 64]} u={0} v={0} w={8} h={8} d={8} s={px}
             style={{ left: 0, top: 0 }} />
      </span>
    </span>
  );
}
