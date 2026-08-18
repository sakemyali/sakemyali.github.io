import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DitherBackground from "./DitherBackground";
import { projects } from "./constants/data.jsx";

// Project detail in the list-layout language: mono, dossier typography,
// bordered demo video, dither smoke behind a readability scrim. Live repo
// stats come straight from the GitHub API so the page stays current.

// Unauthenticated GitHub API: 60 req/h per visitor IP is plenty for a
// portfolio. Fails silently — the page just omits the panel.
function useRepoStats(repo) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!repo) return;
    let alive = true;
    Promise.all([
      fetch(`https://api.github.com/repos/${repo}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://api.github.com/repos/${repo}/languages`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([meta, langs]) => { if (alive && meta) setData({ meta, langs }); })
      .catch(() => {});
    return () => { alive = false; };
  }, [repo]);
  return data;
}

const BAR_SHADES = ["#e5e5e5", "#a3a3a3", "#737373", "#4a4a4a"];

function LanguageBar({ langs }) {
  const entries = Object.entries(langs || {}).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((n, [, v]) => n + v, 0);
  if (!total) return null;
  const top = entries.slice(0, 4);
  return (
    <div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-white/5">
        {top.map(([name, v], i) => (
          <div key={name} style={{ width: `${(v / total) * 100}%`, background: BAR_SHADES[i] }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {top.map(([name, v], i) => (
          <span key={name} className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-sm" style={{ background: BAR_SHADES[i] }} />
            {name} {Math.round((v / total) * 100)}%
          </span>
        ))}
      </div>
    </div>
  );
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });

function RepoPanel({ stats }) {
  if (!stats) return null;
  const { meta, langs } = stats;
  const cells = [
    ["Updated", fmtDate(meta.pushed_at)],
    meta.stargazers_count > 0 && ["Stars", `★ ${meta.stargazers_count}`],
    meta.forks_count > 0 && ["Forks", meta.forks_count],
    ["Size", meta.size > 1024 ? `${(meta.size / 1024).toFixed(1)} MB` : `${meta.size} KB`],
  ].filter(Boolean);
  return (
    <section className="mt-10 rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 mb-4">Repository — live</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-2 mb-4">
        {cells.map(([k, v]) => (
          <div key={k}>
            <span className="text-[11px] text-neutral-600 uppercase tracking-wide">{k} </span>
            <span className="text-[13px] text-neutral-300 ml-1">{v}</span>
          </div>
        ))}
      </div>
      <LanguageBar langs={langs} />
    </section>
  );
}

function ProjectPage() {
  const { slug } = useParams();
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];
  const stats = useRepoStats(project?.repo);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white font-mono gap-4">
        <p className="text-2xl font-bold">Project not found</p>
        <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
          &larr; Back home
        </Link>
      </div>
    );
  }

  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white font-mono">
      <DitherBackground />
      <div className="grain-overlay" />
      <div
        className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-3xl -translate-x-1/2 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(10,10,10,0.85) 12%, rgba(10,10,10,0.85) 88%, transparent 100%)",
        }}
      />

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        <Link to="/" className="text-[13px] text-neutral-500 hover:text-white transition-colors">
          ← index
        </Link>

        <header className="mt-10">
          {project.award && (
            <p className="inline-block text-[11px] tracking-wide text-amber-200/90 border border-amber-200/25 bg-amber-200/[0.06] rounded-full px-3 py-1 mb-3">
              🏆 {project.award}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-neutral-400 text-[15px] mt-3">{project.tagline}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech.map((t) => (
              <span key={t} className="text-[11px] text-neutral-400 border border-white/10 rounded-full px-2.5 py-0.5">
                {t}
              </span>
            ))}
          </div>
        </header>

        <video
          src={`/projectvid${project.id}.mp4`}
          muted loop autoPlay playsInline
          className="w-full rounded-lg border border-white/10 mt-10"
        />

        <section className="mt-10 text-[14px] text-neutral-300 leading-relaxed">
          <p>{project.description}</p>
        </section>

        {project.sections?.map((s) => (
          <section key={s.title} className="mt-8">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 mb-3">{s.title}</h2>
            <p className="text-[14px] text-neutral-300 leading-relaxed">{s.body}</p>
          </section>
        ))}

        {project.highlights && (
          <section className="mt-8">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 mb-3">Highlights</h2>
            <ul className="space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="text-[14px] text-neutral-400 flex gap-3">
                  <span className="text-neutral-600">—</span>{h}
                </li>
              ))}
            </ul>
          </section>
        )}

        <RepoPanel stats={stats} />

        <a href={project.link} target="_blank" rel="noopener noreferrer"
           className="inline-block mt-10 text-[14px] text-neutral-300 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
          View on GitHub ↗
        </a>

        {/* prev / next keeps visitors inside the work instead of bouncing */}
        <nav className="mt-14 pt-6 border-t border-white/10 flex justify-between gap-4 text-[13px]">
          <Link to={`/project/${prev.slug}`} className="text-neutral-500 hover:text-white transition-colors">
            ← {prev.name}
          </Link>
          <Link to={`/project/${next.slug}`} className="text-neutral-500 hover:text-white transition-colors text-right">
            {next.name} →
          </Link>
        </nav>
      </main>
    </div>
  );
}

export default ProjectPage;
