import { useParams, Link } from "react-router-dom";
import DitherBackground from "./DitherBackground";
import { projects } from "./constants/data.jsx";

// Project detail in the list-layout language: mono, dossier typography,
// bordered demo video (not a hero), dither smoke behind a readability scrim.

function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

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
          <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-500">{project.tech[0]}</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">{project.name}</h1>
          <p className="text-neutral-400 text-[15px] mt-3">{project.tagline}</p>
        </header>

        <video
          src={`/projectvid${project.id}.mp4`}
          muted loop autoPlay playsInline
          className="w-full rounded-lg border border-white/10 mt-10"
        />

        <section className="mt-10 text-[14px] text-neutral-300 leading-relaxed">
          <p>{project.description}</p>
        </section>

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

        <a href={project.link} target="_blank" rel="noopener noreferrer"
           className="inline-block mt-10 text-[14px] text-neutral-300 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
          View on GitHub ↗
        </a>
      </main>
    </div>
  );
}

export default ProjectPage;
