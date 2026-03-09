import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Trophy, User, BriefcaseBusiness, Code, GripVertical, RotateCcw, FileText, Swords, GraduationCap, Languages, GitBranch, Sparkles, Palette, Sun, Moon, Search, Command, ArrowRight } from "lucide-react";

import {
  personalInfo,
  experiences,
  projects,
  socialLinks,
  tools,
  hackathons,
  education,
  techStack,
  languages,
  currentlyLearning,
  githubUsername,
  accentThemes,
} from "./constants/data.jsx";


// ── Text Scramble Effect ──
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

function TextScramble({ text, className, delay = 0 }) {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const totalFrames = 20;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const resolved = Math.floor(progress * text.length);
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < resolved) {
          result += text[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(result);
      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text, started]);

  return <span className={className}>{started ? display : ""}</span>;
}

// ── Command Palette ──
const PALETTE_SECTIONS = [
  { id: "profile", label: "Profile", icon: User, type: "section" },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness, type: "section" },
  { id: "education", label: "Education", icon: GraduationCap, type: "section" },
  { id: "projects", label: "Projects", icon: Trophy, type: "section" },
  { id: "techstack", label: "Tech Stack", icon: Code, type: "section" },
  { id: "hackathons", label: "Hackathons", icon: Swords, type: "section" },
  { id: "githubstats", label: "GitHub Activity", icon: GitBranch, type: "section" },
  { id: "languages", label: "Languages", icon: Languages, type: "section" },
  { id: "learning", label: "Currently Exploring", icon: Sparkles, type: "section" },
  { id: "social", label: "Social Links", icon: User, type: "section" },
];

function CommandPalette({ open, onClose, cardElsRef, projects: projectsList }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const projectItems = projectsList.map((p) => ({
    id: `project-${p.slug}`,
    label: p.name,
    desc: p.tagline,
    icon: ArrowRight,
    type: "project",
    slug: p.slug,
  }));

  const allItems = [...PALETTE_SECTIONS, ...projectItems];

  const filtered = query
    ? allItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        (item.desc && item.desc.toLowerCase().includes(query.toLowerCase()))
      )
    : allItems;

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const execute = useCallback((item) => {
    if (item.type === "project") {
      navigate(`/project/${item.slug}`);
    } else {
      const el = cardElsRef.current[item.id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.transition = "box-shadow 0.3s";
        el.style.boxShadow = `0 0 30px rgba(var(--accent-rgb), 0.3)`;
        setTimeout(() => { el.style.boxShadow = ""; }, 1200);
      }
    }
    onClose();
  }, [cardElsRef, navigate, onClose]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      execute(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[201] w-[90vw] max-w-lg font-mono"
            onKeyDown={handleKeyDown}
          >
            <div className="rounded-xl border border-white/10 bg-[#141414]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Search size={16} className="text-neutral-500 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sections, projects..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
                />
                <kbd className="text-[10px] text-neutral-500 px-1.5 py-0.5 rounded border border-white/10 bg-white/5">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-[300px] overflow-y-auto py-2">
                {filtered.length === 0 && (
                  <p className="text-sm text-neutral-500 text-center py-6">No results found</p>
                )}
                {filtered.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => execute(item)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-100 ${
                        i === selectedIndex
                          ? "bg-white/8 text-white"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      <Icon size={15} className="shrink-0 opacity-50" />
                      <span className="flex-1">{item.label}</span>
                      {item.desc && <span className="text-xs text-neutral-600 truncate max-w-[140px]">{item.desc}</span>}
                      {item.type === "project" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-500">project</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5 text-[10px] text-neutral-600">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded border border-white/10 bg-white/5">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded border border-white/10 bg-white/5">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded border border-white/10 bg-white/5">esc</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DockItem({ mouseX, children, onClick, label }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - (bounds.x + bounds.width / 2);
  });

  const widthSync = useTransform(distance, [-120, 0, 120], [40, 56, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 14 });

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={onClick}
      className="dock-item group/dock"
    >
      {children}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[11px] font-medium rounded-md bg-black/80 text-white whitespace-nowrap opacity-0 scale-90 group-hover/dock:opacity-100 group-hover/dock:scale-100 transition-all duration-150 pointer-events-none">
        {label}
      </span>
    </motion.button>
  );
}

const INITIAL_ORDER = [
  "profile",
  "time",
  "experience",
  "education",
  "techstack",
  "languages",
  "social",
  "projects",
  "githubstats",
  "hackathons",
  "learning",
  "skillstools",
];

function App() {
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const [cardOrder, setCardOrder] = useState(INITIAL_ORDER);
  const [draggedId, setDraggedId] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const cardElsRef = useRef({});
  const draggedRef = useRef(null);
  const hoverRef = useRef(null);

  // Typing animation state
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Accent theme state
  const [accentIndex, setAccentIndex] = useState(0);
  const accent = accentThemes[accentIndex];

  // Light/dark mode state
  const [lightMode, setLightMode] = useState(false);

  // Apply accent color as CSS custom property
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent.color);
    document.documentElement.style.setProperty("--accent-rgb", accent.rgb);
  }, [accent]);

  // Apply light/dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);
  }, [lightMode]);

  const toggleLightMode = useCallback(() => {
    setLightMode((prev) => !prev);
  }, []);

  const cycleAccent = useCallback(() => {
    setAccentIndex((prev) => (prev + 1) % accentThemes.length);
  }, []);

  // Typing effect
  useEffect(() => {
    const roles = personalInfo.roles;
    const current = roles[roleIndex];
    const speed = isDeleting ? 40 : 80;
    const pauseEnd = 1800;
    const pauseDelete = 500;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pauseEnd);
        }
      } else {
        setDisplayText(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setRoleIndex((r) => (r + 1) % roles.length);
          setTimeout(() => {}, pauseDelete);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  useEffect(() => {
    setMounted(true);
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keep hoverRef in sync
  useEffect(() => {
    hoverRef.current = hoverIndex;
  }, [hoverIndex]);

  // Pointer move & up listeners — uses refs so always has current values
  useEffect(() => {
    const onMove = (e) => {
      const currentDragged = draggedRef.current;
      if (!currentDragged) return;

      const pointerY = e.clientY;
      let closest = null;
      let closestDist = Infinity;

      for (const [id, el] of Object.entries(cardElsRef.current)) {
        if (!el || id === currentDragged) continue;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(pointerY - mid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = { id, mid, pointerY };
        }
      }
      if (closest) {
        const idx = cardOrder.indexOf(closest.id);
        const newHover = closest.pointerY > closest.mid ? idx + 1 : idx;
        hoverRef.current = newHover;
        setHoverIndex(newHover);
      }
    };

    const onUp = () => {
      const id = draggedRef.current;
      const hi = hoverRef.current;
      if (!id) return;

      if (hi !== null) {
        setCardOrder((prev) => {
          const from = prev.indexOf(id);
          if (from === -1 || from === hi || from + 1 === hi) return prev;
          const next = [...prev];
          next.splice(from, 1);
          const to = hi > from ? hi - 1 : hi;
          next.splice(to, 0, id);
          return next;
        });
      }

      draggedRef.current = null;
      hoverRef.current = null;
      setDraggedId(null);
      setHoverIndex(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [cardOrder]);

  const handleDragStart = (id, e) => {
    e.preventDefault();
    draggedRef.current = id;
    setDraggedId(id);
    setHoverIndex(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const resetOrder = () => {
    setCardOrder(INITIAL_ORDER);
    setDraggedId(null);
    setHoverIndex(null);
  };

  // Command palette state
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ⌘K / Ctrl+K listener
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Cursor spotlight + 3D tilt handler for cards
  const handleCardMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Spotlight
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    // 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  }, []);

  const handleCardMouseLeave = useCallback((e) => {
    e.currentTarget.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  const cardContent = {
    profile: {
      className: "card card-default flex flex-col justify-center gap-3",
      content: (
        <>
          <h2 className="section-title">
            <User size={22} className="text-neutral-400" />
            <p className="text-slate-300 text-sm leading-relaxed animate-blur-in" style={{ animationDelay: "0.2s" }}>{personalInfo.name}</p>
          </h2>
          <p className="text-lg font-semibold h-7 animate-blur-in" style={{ color: accent.color, animationDelay: "0.4s" }}>
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
          <p className="text-sm text-slate-500 leading-relaxed animate-blur-in" style={{ animationDelay: "0.6s" }}>{personalInfo.bio}</p>
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-300 w-fit animate-blur-in"
            style={{ animationDelay: "0.8s" }}
          >
            <FileText size={16} />
            <span>View CV</span>
          </a>
        </>
      ),
    },
    techstack: {
      className: "card card-default flex flex-col justify-center gap-4 overflow-hidden",
      content: (
        <>
          <h2 className="section-title">
            <Code size={20} className="text-neutral-400" />
            <TextScramble text="What I Work With" delay={400} />
          </h2>
          {techStack.map((row, rowIndex) => (
            <div key={rowIndex} className="relative w-full overflow-hidden mask-gradient">
              <motion.div
                className="flex gap-4 whitespace-nowrap w-max"
                animate={{ x: rowIndex % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{ x: { duration: rowIndex % 2 === 0 ? 25 : 30, repeat: Infinity, ease: "linear" } }}
              >
                {[...row, ...row].map((tech, i) => (
                  <span key={i} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-default flex-shrink-0 flex items-center gap-2">
                    <img src={tech.icon} alt={tech.name} className="w-4 h-4 opacity-70" />
                    {tech.name}
                  </span>
                ))}
              </motion.div>
            </div>
          ))}
        </>
      ),
    },
    projects: {
      className: "card card-default flex flex-col gap-4",
      content: (
        <>
          <h2 className="section-title">
            <Trophy size={20} className="text-neutral-400" />
            <TextScramble text="Projects" delay={600} />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {projects.map((project) => (
              <motion.div key={project.id} className="relative group rounded-xl overflow-hidden w-full aspect-video cursor-pointer">
                <Link to={`/project/${project.slug}`} className="block w-full h-full">
                  <video src={`/projectvid${project.id}.mp4`} muted loop autoPlay playsInline className="w-full h-full object-cover transition-all duration-500"></video>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1">
                    <span className="text-white text-sm font-medium">{project.name}</span>
                    <span className="text-neutral-400 text-xs">{project.tagline}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      ),
    },
    time: {
      className: "card card-default flex flex-col justify-center items-start gap-3 overflow-hidden",
      content: (
        <>
          <h2 className="section-title">
            <Clock size={20} className="text-neutral-400" />
            <span>My Local Time [{personalInfo.location}]</span>
          </h2>
          <p className="text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">{time}</p>
        </>
      ),
    },
    social: {
      className: "card card-default flex flex-col justify-center gap-4",
      content: (
        <>
          <h2 className="section-title">
            <User size={20} className="text-neutral-400" />
            <span>Social</span>
          </h2>
          <ul className="space-y-3">
            {socialLinks.map((social, i) => (
              <motion.li key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                <a href={social.link} target="blank" className={`group flex gap-3 items-center text-slate-400 ${social.color}`}>
                  <span className="p-2 rounded-b-lg bg-white/5 group-hover:bg-white/10 transition duration-300 group-hover:scale-110">
                    <social.icon size={18} />
                  </span>
                  <span className="relative font-medium">
                    {social.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-white to-neutral-500 transition-all duration-300 group-hover:w-full" />
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </>
      ),
    },
    experience: {
      className: "card card-default flex flex-col",
      content: (
        <>
          <h2 className="section-title">
            <BriefcaseBusiness size={20} className="text-neutral-400" />
            <TextScramble text="Experience" delay={500} />
          </h2>
          <ul className="space-y-3 px-3 text-sm overflow-y-auto overflow-x-hidden" style={{ maxHeight: "360px" }}>
            {experiences.map((job, i) => (
              <li key={i} className="soft-card group">
                <span className="text-white font-medium flex items-center gap-2">{job.title} - {job.company}</span>
                <span className="text-slate-500 mt-1">{job.period}</span>
                <p className="mt-2 text-slate-400 leading-relaxed">{job.desc}</p>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    skillstools: {
      className: "card card-default flex flex-col justify-center gap-3",
      content: (
        <>
          <h2 className="section-title">
            <BriefcaseBusiness size={20} className="text-neutral-400" />
            <span>Skills & Tools</span>
          </h2>
          <ul className="space-y-2 text-sm">
            {tools.map((tool, i) => (
              <motion.li key={i} whileHover={{ x: 4 }} className="flex items-center gap-2 group">
                <span className="bullet bg-white/30 group-hover:bg-white"></span>
                {tool}
              </motion.li>
            ))}
          </ul>
        </>
      ),
    },
    hackathons: {
      className: "card card-default flex flex-col gap-4",
      content: (
        <>
          <h2 className="section-title">
            <Swords size={20} className="text-neutral-400" />
            <TextScramble text="Hackathons" delay={700} />
          </h2>
          {hackathons.length > 0 ? (
            <ul className="space-y-3 px-3 text-sm overflow-y-auto overflow-x-hidden" style={{ maxHeight: "200px" }}>
              {hackathons.map((hack, i) => (
                <li key={i} className="soft-card group">
                  <span className="text-white font-medium flex items-center gap-2">
                    {hack.name}
                    {hack.result && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">{hack.result}</span>
                    )}
                  </span>
                  <span className="text-slate-500 mt-1">{hack.date}</span>
                  {hack.desc && <p className="mt-2 text-slate-400 leading-relaxed">{hack.desc}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Coming soon...</p>
          )}
        </>
      ),
    },
    education: {
      className: "card card-default flex flex-col gap-4",
      content: (
        <>
          <h2 className="section-title">
            <GraduationCap size={20} className="text-neutral-400" />
            <TextScramble text="Education" delay={550} />
          </h2>
          <ul className="space-y-3 px-3 text-sm overflow-y-auto overflow-x-hidden">
            {education.map((edu, i) => (
              <li key={i} className="soft-card group">
                <span className="text-white font-medium">{edu.school}</span>
                <span className="block text-slate-300 text-xs mt-0.5">{edu.degree}</span>
                <span className="text-slate-500 mt-1">{edu.period}</span>
                <p className="mt-2 text-slate-400 leading-relaxed">{edu.desc}</p>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    languages: {
      className: "card card-default flex flex-col justify-center gap-3",
      content: (
        <>
          <h2 className="section-title">
            <Languages size={20} className="text-neutral-400" />
            <span>Languages</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="stats-box flex flex-col items-center text-center gap-1"
              >
                <span className="text-white font-medium text-sm">{lang.name}</span>
                <span className="text-xs text-slate-500">{lang.level}</span>
              </motion.div>
            ))}
          </div>
        </>
      ),
    },
    githubstats: {
      className: "card card-default flex flex-col gap-4 items-center",
      content: (
        <>
          <h2 className="section-title w-full">
            <GitBranch size={20} className="text-neutral-400" />
            <TextScramble text="GitHub Activity" delay={750} />
          </h2>
          <img
            src={`https://ghchart.rshah.org/${githubUsername}`}
            alt="GitHub contribution chart"
            className="w-full rounded-lg opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
          <div className="flex gap-3 w-full">
            <img
              src={lightMode
                ? `https://github-readme-streak-stats.herokuapp.com?user=${githubUsername}&theme=default&hide_border=true&date_format=j%20M%5B%20Y%5D&ring=2563eb&fire=1a1a1a&currStreakLabel=1a1a1a&sideLabels=4b5563&currStreakNum=1a1a1a&sideNums=374151&dates=6b7280&background=00000000`
                : `https://github-readme-streak-stats.herokuapp.com?user=${githubUsername}&theme=transparent&hide_border=true&date_format=j%20M%5B%20Y%5D&ring=6b7280&fire=ffffff&currStreakLabel=ffffff&sideLabels=9ca3af&currStreakNum=ffffff&sideNums=d4d4d4&dates=525252`
              }
              alt="GitHub streak"
              className="w-full rounded-lg"
            />
          </div>
        </>
      ),
    },
    learning: {
      className: "card card-default flex flex-col justify-center gap-3",
      content: (
        <>
          <h2 className="section-title">
            <Sparkles size={20} className="text-neutral-400" />
            <TextScramble text="Currently Exploring" delay={800} />
          </h2>
          <ul className="space-y-2 text-sm">
            {currentlyLearning.map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 group text-slate-400 hover:text-white transition-colors duration-300"
              >
                <span className="bullet bg-white/30 group-hover:bg-white"></span>
                {item}
              </motion.li>
            ))}
          </ul>
        </>
      ),
    },
  };

  // Build display order: keep dragged card in place (dimmed), insert placeholder at target
  const getDisplayOrder = () => {
    if (!draggedId || hoverIndex === null) return cardOrder;
    const result = [...cardOrder];
    // Insert placeholder at the hover position (clamped)
    const insertAt = Math.min(hoverIndex, result.length);
    result.splice(insertAt, 0, "__placeholder__");
    return result;
  };

  const displayOrder = getDisplayOrder();

  // Dock magnification
  const mouseX = useMotionValue(Infinity);

  return (
    <>
      <div className="grain-overlay" />
      <div className="relative min-h-screen flex justify-center items-center bg-[#0a0a0a] text-white p-4 md:py-14 font-mono overflow-hidden dot-grid">
        {/* Radial vignette */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, transparent 0%, #0a0a0a 70%)",
        }} />

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
          className="main-grid relative"
        >
          {displayOrder.map((id, i) => {
            if (id === "__placeholder__") {
              return (
                <motion.div
                  key="placeholder"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 60, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02]"
                />
              );
            }

            const card = cardContent[id];
            const isDragging = id === draggedId;

            return (
              <motion.div
                key={id}
                ref={(el) => (cardElsRef.current[id] = el)}
                layout
                transition={{ layout: { type: "spring", stiffness: 400, damping: 30 } }}
                variants={itemVariants}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{ zIndex: isDragging ? 100 : 1, transformStyle: "preserve-3d", transition: "transform 0.15s ease-out" }}
                className={`${card.className} card-spotlight group/drag ${isDragging ? "opacity-50 scale-95" : ""}`}
              >
                {/* Drag handle */}
                <div
                  onPointerDown={(e) => handleDragStart(id, e)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/5 opacity-0
                   group-hover/drag:opacity-100 transition-opacity duration-300
                   hover:bg-white/10 z-10 cursor-grab active:cursor-grabbing
                   text-neutral-500 hover:text-neutral-300"
                  title="Drag to reorder"
                >
                  <GripVertical size={14} />
                </div>
                {card.content}
              </motion.div>
            );
          })}
        </motion.main>

        {/* Floating dock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
        >
          <div className="dock">
            <DockItem mouseX={mouseX} onClick={() => setPaletteOpen(true)} label="Search ⌘K">
              <Search size={18} />
            </DockItem>
            <div className="dock-separator" />
            <DockItem mouseX={mouseX} onClick={toggleLightMode} label={lightMode ? "Dark mode" : "Light mode"}>
              {lightMode ? <Moon size={18} /> : <Sun size={18} />}
            </DockItem>
            <DockItem mouseX={mouseX} onClick={cycleAccent} label={`Accent: ${accent.name}`}>
              <Palette size={18} style={{ color: accent.color }} />
            </DockItem>
            <div className="dock-separator" />
            <DockItem mouseX={mouseX} onClick={resetOrder} label="Reset layout">
              <RotateCcw size={18} />
            </DockItem>
          </div>
        </motion.div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        cardElsRef={cardElsRef}
        projects={projects}
      />
    </>
  );
}

export default App;
