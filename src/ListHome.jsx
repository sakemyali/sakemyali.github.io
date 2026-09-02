import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import DitherBackground from "./DitherBackground";
import { DancingSkeletons, WitherHead } from "./PixelMobs";
import {
  personalInfo,
  experiences,
  projects,
  socialLinks,
  education,
  languages,
  publications,
} from "./constants/data.jsx";

// Chiang-style two-column home: sticky left identity column with scroll-spy
// nav, right column of dossier rows, over the dither smoke.

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "education", label: "Education" },
];

function useScrollSpy() {
  const [active, setActive] = useState("about");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

// One dossier row: period gutter left, content right.
const Row = ({ period, title, href, to, sub, desc }) => {
  const inner = (
    <div className="grid grid-cols-[100px_1fr] gap-5 py-4 px-4 -mx-4 rounded-lg border border-transparent
                    transition-[background,border-color,opacity] duration-200
                    group-hover/row:bg-white/[0.04] group-hover/row:border-white/10">
      <span className="text-[11px] text-neutral-500 pt-0.5 leading-relaxed uppercase tracking-wide">{period}</span>
      <div>
        <span className="text-[15px] font-semibold text-neutral-100 group-hover/row:text-white">
          {title}
          {(href || to) && (
            <span className="inline-block ml-1.5 text-neutral-500 transition-transform duration-200 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-white">
              ↗
            </span>
          )}
        </span>
        {sub && <div className="text-[13px] text-neutral-400 mt-0.5">{sub}</div>}
        {desc && <p className="text-[13px] text-neutral-400 leading-relaxed mt-1.5">{desc}</p>}
      </div>
    </div>
  );
  const cls = "group/row block";
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>;
  return <div className={cls}>{inner}</div>;
};

// Mobile-only section label (desktop relies on the left nav, like chiang)
const MobileHead = ({ children }) => (
  <h2 className="lg:hidden text-[12px] tracking-[0.2em] uppercase text-neutral-400 font-bold mb-4 pt-16 first:pt-0">
    {children}
  </h2>
);

// Expandable project row (variant "expand"): unfolds video + highlights inline.
function ExpandRow({ p, open, onToggle }) {
  // video src attaches on open but only detaches after the collapse finishes,
  // so the video doesn't blank out mid-animation
  const [vidSrc, setVidSrc] = useState(null);
  const innerRef = useRef(null);
  useEffect(() => {
    if (open) setVidSrc(`/projectvid${p.id}.mp4`);
  }, [open, p.id]);
  return (
    <div className="group/row block cursor-pointer" onClick={onToggle} role="button">
      <div className={`grid grid-cols-[100px_1fr] gap-5 py-4 px-4 -mx-4 rounded-lg border
                      transition-[background,border-color,opacity] duration-200 ${
                        open
                          ? "bg-white/[0.04] border-white/10"
                          : "border-transparent group-hover/row:bg-white/[0.04] group-hover/row:border-white/10"
                      }`}>
        <span className="text-[11px] text-neutral-500 pt-0.5 leading-relaxed uppercase tracking-wide">{p.tech[0]}</span>
        <div>
          <span className="text-[15px] font-semibold text-neutral-100 group-hover/row:text-white">
            {p.name}
            <span className={`inline-block ml-2 text-neutral-500 transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
              ▸
            </span>
          </span>
          <p className="text-[13px] text-neutral-400 leading-relaxed mt-1.5">{p.tagline}</p>
          {/* measured-height slide: Safari won't interpolate grid rows to 0fr */}
          <div style={{
                 height: open ? innerRef.current?.scrollHeight ?? "auto" : 0,
                 overflow: "hidden",
                 transition: "height .45s cubic-bezier(.4,0,.2,1)",
               }}
               onTransitionEnd={(e) => {
                 // ignore bubbled transitionends from the content fade
                 if (e.target === e.currentTarget && !open) setVidSrc(null);
               }}>
            <div ref={innerRef} onClick={(e) => e.stopPropagation()}>
              {/* pt-4 not mt-4: margins don't count in scrollHeight, which
                  clipped the bottom links by exactly the margin */}
              <div className={`pt-4 space-y-4 pb-1 transition-opacity duration-300 ${open ? "opacity-100 delay-150" : "opacity-0"}`}>
                <video
                  src={vidSrc || undefined}
                  muted loop autoPlay playsInline
                  className="w-full max-w-md aspect-video object-cover rounded-lg border border-white/10"
                />
                <p className="text-[13px] text-neutral-400 leading-relaxed">{p.description}</p>
                {p.highlights && (
                  <ul className="space-y-1.5">
                    {p.highlights.map((h) => (
                      <li key={h} className="text-[13px] text-neutral-400 flex gap-2.5">
                        <span className="text-neutral-600">—</span>{h}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-6">
                  <Link to={`/project/${p.slug}`}
                        className="text-[13px] text-neutral-300 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
                    See more →
                  </Link>
                  <a href={p.link} target="_blank" rel="noreferrer"
                     className="text-[13px] text-neutral-300 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
                    GitHub ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListHome() {
  const active = useScrollSpy();
  const [openSlug, setOpenSlug] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white font-mono">
      <DitherBackground />
      <div className="grain-overlay" />
      {/* readability scrim behind the content container */}
      <div
        className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-6xl -translate-x-1/2 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(10,10,10,0.85) 10%, rgba(10,10,10,0.85) 90%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:flex lg:gap-8">
        {/* ── left column: sticky identity ── */}
        <header className="lg:sticky lg:top-0 lg:h-screen lg:w-[42%] lg:flex lg:flex-col lg:justify-between py-16 lg:py-24">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              {personalInfo.name}
            </h1>
            <p className="text-lg text-neutral-300 mt-4">{personalInfo.role}</p>
            <p className="text-[14px] text-neutral-500 leading-relaxed mt-4 max-w-xs">
              I build secure, scalable systems in C, Python, and the cloud.
            </p>

            {/* scroll-spy nav with growing indicator lines */}
            <nav className="hidden lg:block mt-16">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="group flex items-center gap-4 py-2.5">
                  <span
                    className={`h-px transition-all duration-300 ${
                      active === s.id
                        ? "w-16 bg-white"
                        : "w-8 bg-neutral-600 group-hover:w-16 group-hover:bg-neutral-300"
                    }`}
                  />
                  <span
                    className={`text-[11px] tracking-[0.2em] uppercase transition-colors ${
                      active === s.id ? "text-white" : "text-neutral-500 group-hover:text-neutral-200"
                    }`}
                  >
                    {s.id === "about" ? <WitherHead px={2} /> : s.label}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* socials pinned to the bottom of the column */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-10 lg:mt-0 text-[13px]">
            {socialLinks.map((s) => {
              const Icon = s.icon;
              return (
                <a key={s.name} href={s.link} target="_blank" rel="noreferrer"
                   className="group/soc flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors">
                  <Icon size={14} className="opacity-60 group-hover/soc:opacity-100 transition-opacity" />
                  {s.name}
                </a>
              );
            })}
            <a href="/cv.pdf" target="_blank" rel="noreferrer"
               className="group/soc flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors">
              <FileText size={14} className="opacity-60 group-hover/soc:opacity-100 transition-opacity" />
              CV
            </a>
          </div>
        </header>

        {/* ── right column: scrolling content ── */}
        <main className="lg:w-[58%] lg:py-24 pb-24">
          <section id="about" className="scroll-mt-24">
            {/* heading first so it doesn't sit between the walkers and the text
                on phones; negative margin seats their feet on the first line */}
            <MobileHead><WitherHead px={2} /></MobileHead>
            <div className="-mb-1.5">
              <DancingSkeletons />
            </div>
            <div className="text-[14px] text-neutral-300 leading-relaxed space-y-4">
              <p>
                I'm a backend &amp; ML engineer in Tokyo with a cybersecurity
                foundation — 1st Class Honours in Cyber Security, ranked 1st in
                42 Tokyo's entrance Piscine. I'm as comfortable in C and systems
                programming as in the cloud layer above it.
              </p>
              <p>
                Right now I'm doing AI/ML engineering at Dassault Systèmes,
                joining Morgan Stanley's Institutional Equity Division, and
                building retrieval systems for a stealth AI startup — most
                recently a production RAG service that lifted answer accuracy
                ~20% and cut query overhead ~70%.
              </p>
              <p className="text-neutral-500">
                Security shapes how I build: threat-first design, measured
                before optimized. I work in four languages —{" "}
                {languages.map((l) => l.name).join(", ")}.
              </p>
            </div>
          </section>

          <section id="experience" className="scroll-mt-24 mt-20">
            <MobileHead>Experience</MobileHead>
            <div className="dim-list">
              {experiences.map((e) => (
                <Row key={e.company} period={e.period} title={e.company} sub={e.title} desc={e.desc} />
              ))}
            </div>
          </section>

          <section id="projects" className="scroll-mt-24 mt-20">
            <MobileHead>Projects</MobileHead>
            <div className="dim-list">
              {projects.map((p) => (
                <ExpandRow key={p.slug} p={p} open={openSlug === p.slug}
                           onToggle={() => setOpenSlug(openSlug === p.slug ? null : p.slug)} />
              ))}
            </div>
          </section>

          <section id="research" className="scroll-mt-24 mt-20">
            <MobileHead>Research</MobileHead>
            <div className="dim-list">
              {publications.map((p) => (
                <Row key={p.title} period={p.period} title={p.title} sub={p.venue}
                     href={p.link} desc={p.desc} />
              ))}
            </div>
          </section>

          <section id="education" className="scroll-mt-24 mt-20">
            <MobileHead>Education</MobileHead>
            <div className="dim-list">
              {education.map((e) => (
                <Row key={e.school} period={e.period} title={e.school} sub={e.degree} desc={e.desc} />
              ))}
            </div>
          </section>

          <footer className="mt-24 text-[12px] text-neutral-600 leading-relaxed">
            <a href={`mailto:${personalInfo.email}`}
               className="text-neutral-400 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
              {personalInfo.email}
            </a>
            <p className="mt-4">Built with React, Tailwind, and one WebGL shader. Click the smoke.</p>
          </footer>
        </main>
      </div>

      {/* group-dim: hovering one row fades the siblings */}
      <style>{`
        .dim-list:hover .group\\/row:not(:hover) { opacity: .45; }
        .dim-list .group\\/row { transition: opacity .25s ease; }
      `}</style>
    </div>
  );
}
