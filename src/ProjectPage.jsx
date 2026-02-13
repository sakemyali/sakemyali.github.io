import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { projects } from "./constants/data.jsx";

function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white font-mono gap-4">
        <p className="text-2xl font-bold">Project not found</p>
        <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors duration-300">
          &larr; Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {/* Hero video */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <video
          src={`/projectvid${project.id}.mp4`}
          muted
          loop
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-300 backdrop-blur-sm bg-black/30 px-3 py-2 rounded-lg"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto px-6 -mt-20 relative z-10 pb-20"
      >
        {/* Title & tagline */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.name}</h1>
        <p className="text-neutral-400 text-lg mb-6">{project.tagline}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech.map((t, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-neutral-300"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white/90 mb-3">About</h2>
          <p className="text-neutral-400 leading-relaxed">{project.description}</p>
        </div>

        {/* Highlights */}
        {project.highlights && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white/90 mb-3">Highlights</h2>
            <ul className="space-y-2">
              {project.highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-neutral-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                  {h}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* GitHub link */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium"
        >
          <ExternalLink size={16} />
          View on GitHub
        </a>
      </motion.div>
    </div>
  );
}

export default ProjectPage;
