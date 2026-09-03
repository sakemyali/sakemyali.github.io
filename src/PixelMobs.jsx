import { useEffect, useRef, useState } from "react";

// Flat mobs straight from the official Minecraft entity texture atlases
// (public/mc/*.png, © Mojang — non-commercial fan use). Nothing is recoloured,
// shaded or redrawn: every body part is one div showing one untouched face of
// its UV block. Standing, a mob shows its front (or back) faces; walking, it
// shows its side faces — the same sprite the game's texture already contains,
// seen from the side — with a plain 2D walk cycle: limbs swing from hip and
// shoulder in the picture plane. No bob, no sway, no 3D.

const A32 = [64, 32];
// UV block origins + dims for the skeleton family (slim 2x12x2 limbs)
const HEAD = { u: 0, v: 0, w: 8, h: 8, d: 8 };
const BODY = { u: 16, v: 16, w: 8, h: 12, d: 4 };
const ARM = { u: 40, v: 16, w: 2, h: 12, d: 2 };
const LEG = { u: 0, v: 16, w: 2, h: 12, d: 2 };
// the two spine columns of the body's back face, as a 2-wide strip (d=0 so
// Sprite's front-face maths reads it straight from the atlas)
const SPINE = { u: 35, v: 20, w: 2, h: 12, d: 0 };

// One face of one UV block, at texel scale s. A block's faces sit in a fixed
// row at v+d: side (d wide), front (w), other side (d), back (w).
function Sprite({ src, atlas, u, v, w, h, d, s, face = "front", className, style }) {
  const [fx, fw] =
    face === "side" ? [u, d]
    : face === "back" ? [u + 2 * d + w, w]
    : [u + d, w];
  return (
    <div className={className} style={{
      position: "absolute",
      width: fw * s, height: h * s,
      backgroundImage: `url(${src})`,
      backgroundPosition: `${-fx * s}px ${-(v + d) * s}px`,
      backgroundSize: `${atlas[0] * s}px ${atlas[1] * s}px`,
      imageRendering: "pixelated",
      ...style,
    }} />
  );
}

// Chibi build: the head renders at s*headScale while the body stays at s.
// view "side" is the walking sprite — only the near arm and leg are visible,
// because that is all a side view of the model shows.
function Skeleton({ src, s, headScale = 1.35, view }) {
  const s2 = s * headScale;
  const hs = 8 * s2;              // head is 8 texels on every face
  const H = hs + 22 * s;          // legs tuck 2 texels up under the ribcage:
  const t = { src, atlas: A32, s };  // the texture's pelvis rows are transparent

  if (view === "side") {
    const W = Math.max(8 * s2, 4 * s);
    const cx = W / 2;
    return (
      <div style={{ position: "relative", width: W, height: H }}>
        {/* paint order is depth: far limbs, torso, near limbs, head. Limbs
            pivot at the hip/shoulder; the far pair runs a half-cycle behind
            the near pair, and arms swing opposite their own-side leg. */}
        <Sprite {...t} {...LEG} face="side" className="mc-far" style={{ left: cx - s, top: hs + 10 * s }} />
        <Sprite {...t} {...ARM} face="side" className="mc-near" style={{ left: cx - s, top: hs }} />
        {/* the side face is rib slats with gaps; the spine sits at the rear
            edge (x=0 — the unflipped sprite faces right) and shows through */}
        <Sprite {...t} {...SPINE} style={{ left: cx - 2 * s, top: hs }} />
        <Sprite {...t} {...BODY} face="side" style={{ left: cx - 2 * s, top: hs }} />
        <Sprite {...t} {...LEG} face="side" className="mc-near" style={{ left: cx - s, top: hs + 10 * s }} />
        <Sprite {...t} {...ARM} face="side" className="mc-far" style={{ left: cx - s, top: hs }} />
        <Sprite {...t} {...HEAD} s={s2} face="side" style={{ left: cx - 4 * s2, top: 0 }} />
      </div>
    );
  }

  const face = view === "back" ? "back" : "front";
  const W = Math.max(12 * s, hs);
  const cx = W / 2;
  return (
    <div style={{ position: "relative", width: W, height: H }}>
      <Sprite {...t} {...ARM} face={face} style={{ left: cx - 6 * s, top: hs }} />
      <Sprite {...t} {...ARM} face={face} style={{ left: cx + 4 * s, top: hs }} />
      <Sprite {...t} {...LEG} face={face} style={{ left: cx - 3 * s, top: hs + 10 * s }} />
      <Sprite {...t} {...LEG} face={face} style={{ left: cx + s, top: hs + 10 * s }} />
      {/* the ribcage has holes and the spine is painted on the opposite face:
          show the far face through them, mirrored, as a see-through box would */}
      <Sprite {...t} {...BODY} face={face === "back" ? "front" : "back"}
              style={{ left: cx - 4 * s, top: hs, transform: "scaleX(-1)" }} />
      <Sprite {...t} {...BODY} face={face} style={{ left: cx - 4 * s, top: hs }} />
      <Sprite {...t} {...HEAD} s={s2} face={face} style={{ left: cx - hs / 2, top: 0 }} />
    </div>
  );
}

// Walk cycle: each leg swings ±STEP_DEG about the hip over STEP_S seconds.
// Travel speed is derived from that, so the planted foot never slides: one
// step covers 2·L·sin(θ) of ground, and a cycle is two steps.
const STEP_DEG = 16, STEP_S = 1.2;
const stride = (s) => 4 * LEG.h * s * Math.sin(STEP_DEG * Math.PI / 180) / STEP_S; // px/s

// One autonomous mob: rAF moves it while walking; a decision timer picks the
// next action (walk / stand / turn away) at random. Walking shows the side
// sprite, mirrored to face travel; standing turns back to the viewer.
function Mob({ m, stageRef }) {
  const elRef = useRef(null);
  const [pose, setPose] = useState({ p: "walk", dir: 1 });
  const poseRef = useRef("walk");
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = elRef.current;
    let x = m.home, dir = m.home > 150 ? -1 : 1, raf, timer, pauseTimer, alive = true;
    const spd = stride(m.s);
    const go = (p) => { poseRef.current = p; setPose({ p, dir }); };
    let last = performance.now();
    const step = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (poseRef.current === "walk") {
        const max = Math.max(0, (stageRef.current?.clientWidth ?? 320) - el.offsetWidth);
        x += dir * spd * dt;
        if (x <= 0 || x >= max) { // end of the line: pause a beat, then turn
          x = Math.min(Math.max(x, 0), max);
          go("stand");
          clearTimeout(pauseTimer);
          pauseTimer = setTimeout(() => { if (alive) { dir *= -1; go("walk"); } }, 250 + Math.random() * 400);
        }
        el.style.transform = `translateX(${x}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const decide = () => {
      if (!alive) return;
      const r = Math.random();
      const next = r < 0.55 ? "walk" : r < 0.85 ? "stand" : "back";
      if (next === "walk" && Math.random() < 0.2) dir *= -1; // occasionally wander off the other way
      go(next);
      timer = setTimeout(decide, 2200 + Math.random() * 3800);
    };
    timer = setTimeout(decide, 1000 + Math.random() * 3000);
    // click: stop and face the viewer for a few seconds, then carry on
    el.onclick = () => { go("stand"); clearTimeout(timer); clearTimeout(pauseTimer); timer = setTimeout(decide, 3000); };
    el.style.cursor = "pointer"; // only while a handler is attached (not under reduced motion)
    return () => { alive = false; el.onclick = null; el.style.cursor = ""; cancelAnimationFrame(raf); clearTimeout(timer); clearTimeout(pauseTimer); };
  }, [m, stageRef]);

  const side = pose.p === "walk";
  return (
    <div ref={elRef} className="mob"
         style={{ position: "absolute", bottom: 0, left: 0, transform: `translateX(${m.home}px)` }}>
      {/* mirror the side sprite to face travel; front/back views need no flip */}
      <div style={{ transform: side && pose.dir === -1 ? "scaleX(-1)" : "none" }}>
        <Skeleton src={m.src} s={m.s} headScale={m.headScale}
                  view={side ? "side" : pose.p === "back" ? "back" : "front"} />
      </div>
    </div>
  );
}

const MOBS = [
  { cls: "mob-a", src: "/mc/skeleton.png", s: 3, headScale: 1.35, home: 10 },
  { cls: "mob-w", src: "/mc/wither_skeleton.png", s: 4, headScale: 1.3, home: 90 },
  { cls: "mob-b", src: "/mc/skeleton.png", s: 3, headScale: 1.35, home: 180 },
  { cls: "mob-baby", src: "/mc/skeleton.png", s: 2, headScale: 1.5, home: 260 },
];

export function DancingSkeletons() {
  const stageRef = useRef(null);
  return (
    <div ref={stageRef} className="mcstage" aria-hidden="true"
         style={{ position: "relative", width: "100%", height: 150 }}>
      {MOBS.map((m) => <Mob key={m.cls} m={m} stageRef={stageRef} />)}
      <style>{`
        /* index.css transitions \`background\` globally, which would tween
           background-position through the atlas on every face switch */
        .mcstage .mob * { transition: none; }
        /* side-view walk: near and far limb pairs scissor a half-cycle apart.
           The keyframes are a palindrome, so the delay alone gives the
           diagonal gait — no second keyframe set needed. */
        .mcstage .mc-near, .mcstage .mc-far {
          transform-origin: 50% 0;
          animation: mc-step ${STEP_S}s ease-in-out infinite;
        }
        .mcstage .mc-far { animation-delay: -${STEP_S / 2}s; }
        @keyframes mc-step { 0%,100% { transform: rotate(${STEP_DEG}deg) } 50% { transform: rotate(-${STEP_DEG}deg) } }
        @media (prefers-reduced-motion: reduce) { .mcstage * { animation: none !important; } }
      `}</style>
    </div>
  );
}

// Wither boss center head, flat, used as the "About" label.
export function WitherHead({ px = 2 }) {
  return (
    <span role="img" aria-label="About"
          style={{ display: "inline-block", verticalAlign: "middle", width: 8 * px, height: 8 * px }}>
      <Sprite src="/mc/wither.png" atlas={[64, 64]} u={0} v={0} w={8} h={8} d={8} s={px}
              style={{ position: "relative" }} />
    </span>
  );
}
