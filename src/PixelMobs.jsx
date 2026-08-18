import { useEffect, useRef, useState } from "react";

// 3D mobs from the official Minecraft entity texture atlases (public/mc/*.png,
// © Mojang — non-commercial fan use). Each body part is a CSS-3D box
// (front/left/right/top faces from its UV block, sides shaded). Each mob runs
// its own wander brain: walks (yawing to face travel), idles, looks at the
// viewer, or glances back — independently, bounded by the text width. Limbs
// swing forward/back with rotateX, exactly like the game's walk cycle.

// One textured box. (u,v) = UV block origin, (w,h,d) = box dims in texels.
// withBack also renders the back face (needed where the front is transparent
// — the skeleton spine lives on the body's back face — and for turned heads).
function Box({ src, atlas, u, v, w, h, d, s, className, style, withBack }) {
  const D = d * s;
  const face = (cx, cy, cw, ch, transform, bright, extra) => (
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
      ...extra,
    }} />
  );
  return (
    <div className={className}
         style={{ position: "absolute", width: w * s, height: h * s, transformStyle: "preserve-3d", ...style }}>
      {/* inner shell centers the box's depth on its layout plane, so limb
          rotation animations on the outer div don't wipe the centering */}
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateZ(${-D / 2}px)` }}>
        {withBack && face(u + 2 * d + w, v + d, w, h, "translateZ(0px)", 0.55, { backfaceVisibility: "visible" })}
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

const YAW = 42; // deg the body turns toward its travel direction

// Chibi build: the head renders at s*headScale while the body stays at s.
// headYaw: extra head rotateY for look-at-viewer / glance-back poses
// (only applied while standing, where the head-sway animation is off).
function SkeletonBody({ src, s, headScale = 1.35, headYaw = 0 }) {
  const s2 = s * headScale;
  const hs = 8 * s2;
  const W = Math.max(12 * s, hs);
  const H = hs + 22 * s; // legs tuck 2 texels up under the ribcage: the
  const cx = W / 2;      // texture's pelvis rows are transparent
  const t = { src, atlas: A32 };
  return (
    <div className="mc-walkbob" style={{ position: "relative", width: W, height: H, transformStyle: "preserve-3d" }}>
      <Box {...t} {...ARM} s={s} className="mc-arm-l" style={{ left: cx - 6 * s, top: hs, transformOrigin: "50% 0" }} />
      <Box {...t} {...ARM} s={s} className="mc-arm-r" style={{ left: cx + 4 * s, top: hs, transformOrigin: "50% 0" }} />
      <Box {...t} {...LEG} s={s} className="mc-leg-l" style={{ left: cx - 3 * s, top: hs + 10 * s, transformOrigin: "50% 0" }} />
      <Box {...t} {...LEG} s={s} className="mc-leg-r" style={{ left: cx + 1 * s, top: hs + 10 * s, transformOrigin: "50% 0" }} />
      <Box {...t} {...BODY} s={s} withBack style={{ left: cx - 4 * s, top: hs }} />
      <Box {...t} {...HEAD} s={s2} withBack className="mc-head"
           style={{
             left: cx - hs / 2, top: 0, transformOrigin: "50% 100%",
             transform: headYaw ? `rotateY(${headYaw}deg)` : undefined,
             transition: "transform .3s",
           }} />
    </div>
  );
}

const SPEED = 26; // px/s amble

// One autonomous mob: rAF moves it while walking; a decision timer picks the
// next action (walk / idle / look at viewer / glance back) at random.
function Mob({ m, stageRef }) {
  const elRef = useRef(null);
  const yawRef = useRef(null);
  const [pose, setPose] = useState({ p: "walk", dir: 1 });
  const poseRef = useRef("walk");
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = elRef.current, yawEl = yawRef.current;
    let x = m.home, dir = m.home > 150 ? -1 : 1, raf, timer, pauseTimer, alive = true;
    let spd = SPEED * (0.8 + Math.random() * 0.5); // per-segment gait variation
    const tilt = () => { yawEl.style.transform = `perspective(600px) rotateX(-8deg) rotateY(${dir * YAW}deg)`; };
    tilt();
    const go = (p) => { poseRef.current = p; setPose({ p, dir }); };
    const turn = () => { dir *= -1; tilt(); };
    let last = performance.now();
    const step = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (poseRef.current === "walk") {
        const max = Math.max(0, (stageRef.current?.clientWidth ?? 320) - el.offsetWidth);
        x += dir * spd * (m.baby ? 1.2 : 1) * dt;
        if (x <= 0 || x >= max) { // end of the line: pause a beat, then turn
          x = Math.min(Math.max(x, 0), max);
          go("idle");
          clearTimeout(pauseTimer);
          pauseTimer = setTimeout(() => { if (alive) { turn(); go("walk"); } }, 250 + Math.random() * 400);
        }
        el.style.transform = `translateX(${x}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const decide = () => {
      if (!alive) return;
      const r = Math.random();
      const next = r < 0.45 ? "walk" : r < 0.65 ? "idle" : r < 0.85 ? "front" : "back";
      if (next === "walk") {
        spd = SPEED * (0.8 + Math.random() * 0.5);
        if (Math.random() < 0.2) turn(); // occasionally wander off the other way
      }
      go(next);
      timer = setTimeout(decide, 2200 + Math.random() * 3800);
    };
    timer = setTimeout(decide, 1000 + Math.random() * 3000);
    return () => { alive = false; cancelAnimationFrame(raf); clearTimeout(timer); clearTimeout(pauseTimer); };
  }, [m, stageRef]);

  // look at viewer = head counter-yaws to cancel the body yaw;
  // glance back = head turns ~130deg past the body toward its rear
  const headYaw = pose.p === "front" ? -pose.dir * YAW
                : pose.p === "back" ? pose.dir * 130 : 0;

  return (
    <div ref={elRef} className={`mob ${pose.p === "walk" ? "" : "is-still"}`}
         style={{ position: "absolute", bottom: 0, left: 0, transform: `translateX(${m.home}px)` }}>
      <div ref={yawRef} style={{ transition: "transform .35s", transformStyle: "preserve-3d" }}>
        <SkeletonBody src={m.src} s={m.s} headScale={m.headScale} headYaw={headYaw} />
      </div>
    </div>
  );
}

const MOBS = [
  { cls: "mob-a", src: "/mc/skeleton.png", s: 3, headScale: 1.35, home: 10 },
  { cls: "mob-w", src: "/mc/wither_skeleton.png", s: 4, headScale: 1.3, home: 90 },
  { cls: "mob-b", src: "/mc/skeleton.png", s: 3, headScale: 1.35, home: 180 },
  { cls: "mob-baby", src: "/mc/skeleton.png", s: 2, headScale: 1.5, home: 260, baby: true },
];

export function DancingSkeletons() {
  const stageRef = useRef(null);
  return (
    <div ref={stageRef} className="mcstage" aria-hidden="true"
         style={{ position: "relative", width: "100%", height: 150 }}>
      {MOBS.map((m) => <Mob key={m.cls} m={m} stageRef={stageRef} />)}
      <style>{`
        /* faint glow lifts the bones off the dark background (safe here:
           .mob itself is never 3D-rotated, so the filter flattening is a no-op) */
        .mcstage .mob { filter: drop-shadow(0 0 2px rgba(255,255,255,.16)); }
        /* game walk: limbs swing forward/back (rotateX) as smooth cosines;
           diagonal gait via -half-cycle delay (keyframes are palindromes, so
           direction:reverse would play the identical motion). Bob per footfall. */
        .mcstage .mc-walkbob { animation: mc-walkbob .375s ease-in-out infinite; }
        .mcstage .mc-head { animation: mc-head 2.4s ease-in-out infinite; }
        .mcstage .mc-arm-l { animation: mc-swing-arm .75s ease-in-out infinite; }
        .mcstage .mc-arm-r { animation: mc-swing-arm .75s ease-in-out infinite; animation-delay: -.375s; }
        .mcstage .mc-leg-l { animation: mc-swing-leg .75s ease-in-out infinite; animation-delay: -.375s; }
        .mcstage .mc-leg-r { animation: mc-swing-leg .75s ease-in-out infinite; }
        @keyframes mc-walkbob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-1.5px) } }
        @keyframes mc-head { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3deg) } }
        @keyframes mc-swing-leg { 0%,100% { transform: rotateX(22deg) } 50% { transform: rotateX(-22deg) } }
        @keyframes mc-swing-arm { 0%,100% { transform: rotateX(-14deg) } 50% { transform: rotateX(14deg) } }
        /* standing still: limbs and head sway drop to rest so look poses
           (inline head transform) aren't clobbered by the animation */
        .mcstage .is-still .mc-walkbob,
        .mcstage .is-still .mc-head,
        .mcstage .is-still .mc-arm-l, .mcstage .is-still .mc-arm-r,
        .mcstage .is-still .mc-leg-l, .mcstage .is-still .mc-leg-r { animation: none; }
        @media (prefers-reduced-motion: reduce) {
          .mcstage * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

// Wither boss center head as a small 3D cube, used as the "About" label.
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
