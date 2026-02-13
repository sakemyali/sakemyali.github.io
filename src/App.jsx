import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, Trophy, User, BriefcaseBusiness, Code, GripVertical, RotateCcw, FileText, Swords, GraduationCap, Languages, GitBranch, Sparkles } from "lucide-react";

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
} from "./constants/data.jsx";


const INITIAL_ORDER = [
  "profile",
  "time",
  "experience",
  "education",
  "social",
  "languages",
  "projects",
  "techstack",
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
      transition: { staggerChildren: 0.2, duration: 0.7 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const resetOrder = () => {
    setCardOrder(INITIAL_ORDER);
    setDraggedId(null);
    setHoverIndex(null);
  };

  const cardContent = {
    profile: {
      className: "card card-default flex flex-col justify-center gap-3",
      content: (
        <>
          <h2 className="section-title">
            <User size={22} className="text-neutral-400" />
            <p className="text-slate-300 text-sm leading-relaxed">{personalInfo.name}</p>
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">{personalInfo.bio}</p>
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-300 w-fit"
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
            <span>What I Work With</span>
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
            <span>Projects</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {projects.map((project) => (
              <motion.div key={project.id} className="relative group rounded-xl overflow-hidden w-full aspect-video cursor-pointer">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <video src={`projectvid${project.id}.mp4`} muted loop autoPlay playsInline className="w-full h-full object-cover transition-all duration-500"></video>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">View on GitHub</span>
                  </div>
                </a>
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
            <span>Experience</span>
          </h2>
          <ul className="space-y-3 px-3 text-sm overflow-y-auto overflow-x-hidden">
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
            <span>Hackathons</span>
          </h2>
          {hackathons.length > 0 ? (
            <ul className="space-y-3 px-3 text-sm overflow-y-auto overflow-x-hidden">
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
            <span>Education</span>
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
            <span>GitHub Activity</span>
          </h2>
          <img
            src={`https://ghchart.rshah.org/6b7280/${githubUsername}`}
            alt="GitHub contribution chart"
            className="w-full rounded-lg opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
          <div className="flex gap-3 w-full">
            <img
              src={`https://github-readme-streak-stats.herokuapp.com?user=${githubUsername}&theme=transparent&hide_border=true&date_format=j%20M%5B%20Y%5D&ring=6b7280&fire=ffffff&currStreakLabel=ffffff&sideLabels=9ca3af&currStreakNum=ffffff&sideNums=d4d4d4&dates=525252`}
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
            <span>Currently Exploring</span>
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

  return (
    <>
      <div className="relative min-h-screen flex justify-center items-center bg-[#0a0a0a] text-white p-4 md:py-14 font-mono overflow-hidden">
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
          className="main-grid relative"
        >
          {/* Reset button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={resetOrder}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/5 border border-white/10
             hover:bg-white/10 hover:border-white/20 transition-all duration-300
             text-neutral-500 hover:text-white backdrop-blur-sm"
            title="Reset layout"
          >
            <RotateCcw size={18} />
          </motion.button>

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
                style={{ zIndex: isDragging ? 100 : 1 }}
                className={`${card.className} group/drag ${isDragging ? "opacity-50 scale-95" : ""}`}
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
      </div>
    </>
  );
}

export default App;
