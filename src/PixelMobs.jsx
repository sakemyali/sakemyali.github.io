import { useEffect, useState } from "react";

// Mobs assembled from the official Minecraft entity texture atlases
// (public/mc/*.png, © Mojang — non-commercial fan use). Each body part is a
// real CSS-3D box: front/left/right/top faces cropped from its UV block,
// sides shaded, whole mob tilted into a 3/4 view. Each page load picks ONE
// scene at random — dance, patrol, or bow duel — and loops it.

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
function SkeletonBody({ src, s, headScale = 1.35 }) {
  const s2 = s * headScale;
  const hs = 8 * s2;
  const W = Math.max(12 * s, hs);
  // legs tuck 2 texels up under the ribcage: the texture's pelvis area is
  // mostly transparent, which reads as a floating torso on a dark page
  const H = hs + 22 * s;
  const cx = W / 2;
  const t = { src, atlas: A32 };
  return (
    <div className="mc-bob" style={{ position: "relative", width: W, height: H, transformStyle: "preserve-3d" }}>
      <Box {...t} {...ARM} s={s} className="mc-arm-l" style={{ left: cx - 6 * s, top: hs, transformOrigin: "50% 0" }} />
      <Box {...t} {...ARM} s={s} className="mc-arm-r" style={{ left: cx + 4 * s, top: hs, transformOrigin: "50% 0" }} />
      {/* legs sit at the hips with a gap between them, like the real model */}
      <Box {...t} {...LEG} s={s} className="mc-leg-l" style={{ left: cx - 3 * s, top: hs + 10 * s, transformOrigin: "50% 0" }} />
      <Box {...t} {...LEG} s={s} className="mc-leg-r" style={{ left: cx + 1 * s, top: hs + 10 * s, transformOrigin: "50% 0" }} />
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
  { cls: "mob-a", src: "/mc/skeleton.png", s: 3, headScale: 1.35, home: 0 },
  { cls: "mob-w", src: "/mc/wither_skeleton.png", s: 4, headScale: 1.3, home: 70 },
  { cls: "mob-b", src: "/mc/skeleton.png", s: 3, headScale: 1.35, home: 150 },
  { cls: "mob-baby", src: "/mc/skeleton.png", s: 2, headScale: 1.6, home: 215, baby: true },
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
      {[[26, 0], [100, 1.2], [176, 2.4]].map(([left, delay]) => (
        <span key={left} className="mc-heart"
              style={{ left, bottom: 118, animationDelay: `${delay}s` }}>♥</span>
      ))}
      <style>{`
        /* faint glow lifts the thin bones off the dark background (safe here:
           .mob itself is never 3D-rotated, so the filter flattening is a no-op) */
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
        @keyframes mc-arm-l { 0%,100% { transform: rotate(160deg) } 50% { transform: rotate(200deg) } }
        @keyframes mc-arm-r { 0%,100% { transform: rotate(-160deg) } 50% { transform: rotate(-200deg) } }
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
        /* hurt flash lives on .mob (outside the 3D chain): animating filter on
           an element inside it forces transform-style flat and squashes the 3D */
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
