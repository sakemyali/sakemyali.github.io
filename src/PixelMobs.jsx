// Mobs assembled from the official Minecraft entity texture atlases
// (public/mc/*.png, © Mojang — non-commercial fan use). Each body part is a
// div cropping its front face out of the atlas via background-position;
// limbs/head swing with CSS keyframes for the dance.

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

// Skeleton-family atlas (64x32) front-face crops. Limbs are the slim 2px
// boxes: front face sits at (origin + depth) in each box's UV block.
const A32 = [64, 32];
const FACES = {
  head: { x: 8, y: 8, w: 8, h: 8 },
  body: { x: 20, y: 20, w: 8, h: 12 },
  arm: { x: 42, y: 18, w: 2, h: 12 },
  leg: { x: 2, y: 18, w: 2, h: 12 },
};

function Skeleton({ src, s = 4, delay = 0 }) {
  const d = (extra) => ({ animationDelay: `${delay}s`, ...extra });
  return (
    <div className="mc-bob" style={{ position: "relative", width: 12 * s, height: 32 * s, animationDelay: `${delay}s` }}>
      <Part src={src} atlas={A32} {...FACES.arm} s={s} className="mc-arm-l"
            style={d({ left: 0, top: 8 * s, transformOrigin: "50% 0" })} />
      <Part src={src} atlas={A32} {...FACES.arm} s={s} className="mc-arm-r"
            style={d({ left: 10 * s, top: 8 * s, transformOrigin: "50% 0" })} />
      <Part src={src} atlas={A32} {...FACES.leg} s={s} className="mc-leg-l"
            style={d({ left: 4 * s, top: 20 * s, transformOrigin: "50% 0" })} />
      <Part src={src} atlas={A32} {...FACES.leg} s={s} className="mc-leg-r"
            style={d({ left: 6 * s, top: 20 * s, transformOrigin: "50% 0" })} />
      <Part src={src} atlas={A32} {...FACES.body} s={s}
            style={{ left: 2 * s, top: 8 * s }} />
      <Part src={src} atlas={A32} {...FACES.head} s={s} className="mc-head"
            style={d({ left: 2 * s, top: 0, transformOrigin: "50% 100%" })} />
    </div>
  );
}

// Two skeletons flanking a taller wither skeleton, arms up, swaying —
// slightly offset delays so it reads as a groove, not a march.
export function DancingSkeletons() {
  return (
    <div className="flex items-end gap-6" aria-hidden="true">
      <Skeleton src="/mc/skeleton.png" s={3} />
      <Skeleton src="/mc/wither_skeleton.png" s={4} delay={0.25} />
      <Skeleton src="/mc/skeleton.png" s={3} delay={0.5} />
      <style>{`
        .mc-bob { animation: mc-bob 1s ease-in-out infinite; }
        .mc-head { animation: mc-head 1s ease-in-out infinite; }
        .mc-arm-l { animation: mc-arm-l 1s ease-in-out infinite; }
        .mc-arm-r { animation: mc-arm-r 1s ease-in-out infinite; }
        .mc-leg-l { animation: mc-leg 1s ease-in-out infinite; }
        .mc-leg-r { animation: mc-leg 1s ease-in-out infinite reverse; }
        @keyframes mc-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(3px) } }
        @keyframes mc-head { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(8deg) } }
        @keyframes mc-arm-l { 0%,100% { transform: rotate(140deg) } 50% { transform: rotate(200deg) } }
        @keyframes mc-arm-r { 0%,100% { transform: rotate(-200deg) } 50% { transform: rotate(-140deg) } }
        @keyframes mc-leg { 0%,100% { transform: rotate(-6deg) } 50% { transform: rotate(6deg) } }
        @media (prefers-reduced-motion: reduce) {
          .mc-bob, .mc-head, .mc-arm-l, .mc-arm-r, .mc-leg-l, .mc-leg-r { animation: none; }
        }
      `}</style>
    </div>
  );
}

// Wither boss center head (front face, 8x8 at (8,8) in the 64x64 atlas),
// used as the "About" section name.
export function WitherHead({ px = 2 }) {
  return (
    <span
      role="img"
      aria-label="About"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: 8 * px,
        height: 8 * px,
        backgroundImage: "url(/mc/wither.png)",
        backgroundPosition: `${-8 * px}px ${-8 * px}px`,
        backgroundSize: `${64 * px}px ${64 * px}px`,
        imageRendering: "pixelated",
      }}
    />
  );
}
