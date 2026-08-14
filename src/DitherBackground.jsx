import { useEffect, useRef } from "react";

// Reactbits "Dither" background reimplemented in raw WebGL2 (no three.js/r3f).
// FBM Perlin waves + 8x8 Bayer dither, folded into a single fragment pass.
// Tweak the CFG block below to taste.
const CFG = {
  waveColor: [0.5, 0.5, 0.5], // grayscale (black/white look)
  waveSpeed: 0.05,
  waveFrequency: 3.0,
  waveAmplitude: 0.3,
  pixelSize: 2.0, // bigger = chunkier dither
  colorNum: 4.0,
};

const VERT = `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed, waveFrequency, waveAmplitude, pixelSize, colorNum;
uniform vec2 wind;               // ambient drift (uv units/sec, +x = right)
uniform vec3 waveColor;
// typhoon vortices: accumulated twist never unwinds; released ones coast on
// momentum. Positions in gl_FragCoord space (bottom-up px).
const int NV = 6;
uniform vec2 vortexPos[NV];
uniform float vortexAngle[NV];   // accumulated rotation (radians, uncapped)
uniform float vortexPull[NV];    // inward suction strength

vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }
vec2 fade(vec2 t){ return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz, iy = Pi.yyww;
  vec4 fx = Pf.xzxz, fy = Pf.yyww;
  vec4 i = permute(permute(ix)+iy);
  vec4 gx = fract(i*(1.0/41.0))*2.0-1.0;
  vec4 gy = abs(gx)-0.5;
  vec4 tx = floor(gx+0.5);
  gx = gx - tx;
  vec2 g00=vec2(gx.x,gy.x), g10=vec2(gx.y,gy.y), g01=vec2(gx.z,gy.z), g11=vec2(gx.w,gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11)));
  g00*=norm.x; g01*=norm.y; g10*=norm.z; g11*=norm.w;
  float n00=dot(g00,vec2(fx.x,fy.x));
  float n10=dot(g10,vec2(fx.y,fy.y));
  float n01=dot(g01,vec2(fx.z,fy.z));
  float n11=dot(g11,vec2(fx.w,fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00,n01), vec2(n10,n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p){
  float value=0.0, amp=1.0, freq=waveFrequency;
  for(int i=0;i<OCTAVES;i++){ value += amp*abs(cnoise(p)); p*=freq; amp*=waveAmplitude; }
  return value;
}
float pattern(vec2 p){
  p -= wind * time;                       // everything rides the wind
  vec2 p2 = p - time * waveSpeed;         // plus slow internal churn
  return fbm(p + fbm(p2));
}

const float bayer[64] = float[64](
   0.0/64.0,48.0/64.0,12.0/64.0,60.0/64.0, 3.0/64.0,51.0/64.0,15.0/64.0,63.0/64.0,
  32.0/64.0,16.0/64.0,44.0/64.0,28.0/64.0,35.0/64.0,19.0/64.0,47.0/64.0,31.0/64.0,
   8.0/64.0,56.0/64.0, 4.0/64.0,52.0/64.0,11.0/64.0,59.0/64.0, 7.0/64.0,55.0/64.0,
  40.0/64.0,24.0/64.0,36.0/64.0,20.0/64.0,43.0/64.0,27.0/64.0,39.0/64.0,23.0/64.0,
   2.0/64.0,50.0/64.0,14.0/64.0,62.0/64.0, 1.0/64.0,49.0/64.0,13.0/64.0,61.0/64.0,
  34.0/64.0,18.0/64.0,46.0/64.0,30.0/64.0,33.0/64.0,17.0/64.0,45.0/64.0,29.0/64.0,
  10.0/64.0,58.0/64.0, 6.0/64.0,54.0/64.0, 9.0/64.0,57.0/64.0, 5.0/64.0,53.0/64.0,
  42.0/64.0,26.0/64.0,38.0/64.0,22.0/64.0,41.0/64.0,25.0/64.0,37.0/64.0,21.0/64.0
);

vec3 dither(vec2 px, vec3 color){
  int x = int(mod(px.x, 8.0));
  int y = int(mod(px.y, 8.0));
  float threshold = bayer[y*8+x] - 0.25;
  color += threshold * (1.0/(colorNum-1.0));
  color = clamp(color - 0.2, 0.0, 1.0);
  return floor(color*(colorNum-1.0)+0.5)/(colorNum-1.0);
}

void main(){
  float aspect = resolution.x/resolution.y;
  vec2 block = floor(gl_FragCoord.xy / pixelSize);
  vec2 uv = (block*pixelSize)/resolution - 0.5;
  uv.x *= aspect;

  // typhoons: each vortex applies its accumulated twist; the angle only ever
  // grows, so nothing snaps back — released vortices keep coasting
  for (int i = 0; i < NV; i++) {
    vec2 m = vortexPos[i]/resolution - 0.5;
    m.x *= aspect;
    vec2 diff = uv - m;
    float d = length(diff);
    float e = smoothstep(0.22, 0.0, d);   // small whirlpool
    float ang = e * vortexAngle[i];
    float s = sin(ang), c = cos(ang);
    // rotate and sample outward -> the smoke appears sucked inward in a spiral
    uv = m + mat2(c, -s, s, c) * (diff * (1.0 + e * vortexPull[i]));
  }

  float f = pattern(uv);
  vec3 col = mix(vec3(0.0), waveColor, f);
  fragColor = vec4(dither(block, col), 1.0);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

export default function DitherBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const gl = cv.getContext("webgl2");
    if (!gl) return; // ponytail: no WebGL2 -> nothing renders, root bg stays

    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) {
      // ponytail: background must never take down the page — degrade to empty
      console.warn("DitherBackground disabled:", e);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    gl.uniform3f(U("waveColor"), ...CFG.waveColor);
    gl.uniform1f(U("waveSpeed"), CFG.waveSpeed);
    gl.uniform1f(U("waveFrequency"), CFG.waveFrequency);
    gl.uniform1f(U("waveAmplitude"), CFG.waveAmplitude);
    gl.uniform1f(U("pixelSize"), CFG.pixelSize);
    gl.uniform1f(U("colorNum"), CFG.colorNum);
    const uTime = U("time");
    const uRes = U("resolution");
    const uVortexPos = U("vortexPos");
    const uVortexAngle = U("vortexAngle");
    const uVortexPull = U("vortexPull");
    const WIND = 0.045; // uv units/sec, rightward — shared by smoke and drift
    gl.uniform2f(U("wind"), WIND, 0.0);

    // vortex pool: hold spins one up (no cap); release lets it coast on
    // momentum — angle only ever grows, so the twist never unwinds
    const NV = 6;
    const vortices = Array.from({ length: NV }, () =>
      ({ x: -9999, y: -9999, tx: -9999, ty: -9999, A: 0, w: 0, pull: 0, amp: 0 }));
    let cur = -1; // index of the vortex being held, -1 = none
    const onDown = (e) => {
      // ignore clicks on interactive elements (links, buttons…)
      if (e.target.closest?.('a, button, input, textarea, select, [role="button"]')) return;
      const px = e.clientX, py = cv.height - e.clientY;
      // every click starts a fresh whirlpool — released patches are frozen
      // material riding the wind, never re-grabbed. Recycle a free slot,
      // or the one furthest downwind (closest to leaving the screen).
      let best = 0;
      for (let i = 1; i < NV; i++) {
        const a = vortices[i], b = vortices[best];
        if (a.amp < b.amp - 0.01 || (Math.abs(a.amp - b.amp) <= 0.01 && a.x > b.x)) best = i;
      }
      cur = best;
      const v = vortices[cur];
      v.x = v.tx = px; v.y = v.ty = py;
      v.A = 0.8; v.w = 0.9; v.pull = 0.15; v.amp = 0; // small, slow, eases in
    };
    const onMove = (e) => {
      if (cur < 0) return;
      const v = vortices[cur];
      v.tx = e.clientX; v.ty = cv.height - e.clientY;
    };
    const onUp = () => { cur = -1; };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const resize = () => {
      cv.width = innerWidth;   // dpr 1 -> chunkier dither, like the source site
      cv.height = innerHeight;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    const t0 = performance.now();
    const posArr = new Float32Array(NV * 2);
    const angArr = new Float32Array(NV);
    const pullArr = new Float32Array(NV);
    let lastT = performance.now();
    const draw = (t) => {
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      for (let i = 0; i < NV; i++) {
        const v = vortices[i];
        if (i === cur) {
          v.w += 0.12 * dt;                     // slow intensification — endless but gentle
          v.pull = Math.min(v.pull + 0.2 * dt, 0.5);
          v.amp += (1 - v.amp) * Math.min(1, 6 * dt);  // ease in — no pop on press
          v.x += (v.tx - v.x) * Math.min(1, 10 * dt);  // glide toward the pointer
          v.y += (v.ty - v.y) * Math.min(1, 10 * dt);
          v.A += v.w * dt;                      // winding only happens while held
        } else if (v.amp > 0.01) {
          // released: spin stops dead, twist stays frozen exactly as left —
          // no decay, no unwinding. The patch just rides the wind off-screen.
          v.w = 0;
          v.x += WIND * cv.height * dt;         // same speed as the smoke around it
          v.tx = v.x; v.ty = v.y;
          if (v.x - cv.width > 0.25 * cv.height) v.amp = 0; // free the slot once out of view
        }
        posArr[i * 2] = v.x; posArr[i * 2 + 1] = v.y;
        angArr[i] = v.A * v.amp; pullArr[i] = v.pull * v.amp;
      }
      gl.uniform2fv(uVortexPos, posArr);
      gl.uniform1fv(uVortexAngle, angArr);
      gl.uniform1fv(uVortexPull, pullArr);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    if (reduce) {
      draw(0); // static frame, respect reduced-motion
    } else {
      const loop = () => {
        draw((performance.now() - t0) / 1000);
        raf = requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      // ponytail: don't loseContext() here — StrictMode remounts on the same
      // canvas would then get a dead context and render nothing. GC handles it.
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-0 h-full w-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}
