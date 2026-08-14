import { useEffect, useRef, useState } from "react";

// Flat 2D mobs in PROFILE view using the official Minecraft entity textures
// (public/mc/*.png, © Mojang — non-commercial fan use). Each mob runs its own
// little wander brain, like in-game AI: walk a bit, stop, look at the viewer,
// glance back over the shoulder — independently, bounded by the text width.

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
const HEAD_FRONT = { x: 8, y: 8, w: 8, h: 8 };
const BODY_SIDE = { x: 16, y: 20, w: 4, h: 12 };
const ARM_SIDE = { x: 40, y: 18, w: 2, h: 12 };
const LEG_SIDE = { x: 0, y: 18, w: 2, h: 12 };
// the spine is a full-height column on the body's BACK face (cols 3-4);
// in-game it shows through the side face's transparent rib gaps
const SPINE = { x: 35, y: 20, w: 2, h: 12 };

// Chibi build: the head renders at s*headScale while the body stays at s.
// headPose: "side" | "front" (facing the viewer) | "back" (glancing behind)
function SkeletonBody({ src, s, headScale = 1.35, headPose = "side" }) {
  const s2 = s * headScale;
  const hs = 8 * s2;
  const W = Math.max(8 * s, hs);
  const H = hs + 22 * s; // legs tuck 2 texels up under the pelvis
  const cx = W / 2;
  const t = { src, atlas: A32 };
  const dim = { filter: "brightness(.55)" };
  return (
    <div className="mc-walkbob" style={{ position: "relative", width: W, height: H }}>
      {/* far limbs first: dimmed, a texel behind the near ones, counter-phased */}
      <Part {...t} {...ARM_SIDE} s={s} className="mc-limb-far-arm"
            style={{ left: cx - 2 * s, top: hs, transformOrigin: "50% 0", ...dim }} />
      <Part {...t} {...LEG_SIDE} s={s} className="mc-limb-far-leg"
            style={{ left: cx - 2 * s, top: hs + 10 * s, transformOrigin: "50% 0", ...dim }} />
      {/* spine at the back edge, showing through the rib gaps like in-game */}
      <Part {...t} {...SPINE} s={s} style={{ left: cx - 2 * s, top: hs }} />
      <Part {...t} {...BODY_SIDE} s={s} style={{ left: cx - 2 * s, top: hs }} />
      <Part {...t} {...LEG_SIDE} s={s} className="mc-limb-leg"
            style={{ left: cx - s, top: hs + 10 * s, transformOrigin: "50% 0" }} />
      <Part {...t} {...ARM_SIDE} s={s} className="mc-limb-arm"
            style={{ left: cx - s, top: hs, transformOrigin: "50% 0" }} />
      <Part {...t} {...(headPose === "front" ? HEAD_FRONT : HEAD_SIDE)} s={s2} className="mc-head"
            style={{
              left: cx - hs / 2, top: 0, transformOrigin: "50% 100%",
              // glance back = mirrored side head; only applied while standing,
              // where the head-sway animation is off and can't clobber it
              transform: headPose === "back" ? "scaleX(-1)" : undefined,
            }} />
    </div>
  );
}

const SPEED = 26; // px/s amble

// One autonomous mob: rAF moves it while walking; a decision timer picks the
// next action (walk / idle / look at viewer / glance back) at random.
function Mob({ m, stageRef }) {
  const elRef = useRef(null);
  const faceRef = useRef(null);
  const [pose, setPose] = useState("walk");
  const poseRef = useRef("walk");
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = elRef.current, face = faceRef.current;
    let x = m.home, dir = m.home > 150 ? -1 : 1, raf, timer, pauseTimer, alive = true;
    let spd = SPEED * (0.8 + Math.random() * 0.5); // per-segment gait variation
    face.style.transform = `scaleX(${dir})`;
    const go = (p) => { poseRef.current = p; setPose(p); };
    const turn = () => { dir *= -1; face.style.transform = `scaleX(${dir})`; };
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

  return (
    <div ref={elRef} className={`mob ${pose === "walk" ? "" : "is-still"}`}
         style={{ position: "absolute", bottom: 0, left: 0, transform: `translateX(${m.home}px)` }}>
      <div ref={faceRef} style={{ transition: "transform .2s" }}>
        <SkeletonBody src={m.src} s={m.s} headScale={m.headScale}
                      headPose={pose === "front" || pose === "back" ? pose : "side"} />
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
        /* faint glow lifts the thin bones off the dark background */
        .mcstage .mob { filter: drop-shadow(0 0 2px rgba(255,255,255,.16)); }
        /* game walk in profile: smooth cosine; diagonal gait via -half-cycle
           animation-delay (NOT direction:reverse — these keyframes are
           palindromes, so reverse plays the same motion). Near arm + far leg
           together; near leg + far arm together. Bob = one dip per footfall. */
        .mcstage .mc-walkbob { animation: mc-walkbob .375s ease-in-out infinite; }
        .mcstage .mc-head { animation: mc-head 2.4s ease-in-out infinite; }
        .mcstage .mc-limb-arm { animation: mc-swing-arm .75s ease-in-out infinite; }
        .mcstage .mc-limb-far-arm { animation: mc-swing-arm .75s ease-in-out infinite; animation-delay: -.375s; }
        .mcstage .mc-limb-leg { animation: mc-swing-leg .75s ease-in-out infinite; animation-delay: -.375s; }
        .mcstage .mc-limb-far-leg { animation: mc-swing-leg .75s ease-in-out infinite; }
        @keyframes mc-walkbob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-1.5px) } }
        @keyframes mc-head { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3deg) } }
        @keyframes mc-swing-leg { 0%,100% { transform: rotate(20deg) } 50% { transform: rotate(-20deg) } }
        @keyframes mc-swing-arm { 0%,100% { transform: rotate(14deg) } 50% { transform: rotate(-14deg) } }
        /* standing still: limbs and head drop to rest pose */
        .mcstage .is-still .mc-walkbob,
        .mcstage .is-still .mc-head,
        .mcstage .is-still [class*="mc-limb"] { animation: none; }
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
