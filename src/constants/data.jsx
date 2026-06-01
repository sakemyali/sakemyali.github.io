import { Github, Linkedin, Mail, Bot } from "lucide-react";

export const personalInfo = {
  name: "Moulay Ali Sakurai El idrissi",
  role: "Backend & ML Engineer",
  bio: "An engineer working across machine learning and security, happiest working close to the machine. Most interested in LLM systems, computational finance, and post-quantum cryptography.",
  email: "myali.sakurai.elidrissi@gmail.com",
  location: "Japan",
  roles: [
    "Cybersecurity Graduate",
    "42 Tokyo Student",
  ],
};

export const projects = [
  {
    id: 1,
    slug: "doraimon",
    name: "dorAImon",
    link: "https://github.com/sakemyali/Mistral_Hackathon2026",
    tagline: "Real-time AI assistant, 4 Mistral models in parallel",
    description: "Built at the Mistral AI Hackathon 2026. An always-on desktop assistant that watches your screen and orchestrates four Mistral models in parallel — Pixtral-12B for OCR and scene understanding, Ministral-3B for intent classification, Codestral for code suggestions, and Mistral Large for live translation. A Python/FastAPI backend runs three concurrent inference pipelines into an agent router and streams results over WebSocket to a transparent, click-through Electron + React overlay that assists at the right moment without stealing focus.",
    tech: ["Python", "FastAPI", "TypeScript", "React", "Electron", "Mistral"],
    highlights: ["4 Mistral models orchestrated in parallel", "3 real-time pipelines + agent router with 6-gate throttling", "Transparent click-through overlay; multilingual voice via ElevenLabs"],
  },
  {
    id: 2,
    slug: "42-knowledge-bot",
    name: "42 Knowledge Bot",
    link: "https://github.com/sakemyali/42-discord-bot",
    tagline: "RAG Discord bot for 42 Tokyo",
    description: "A staff-support Q&A bot for 42 Tokyo, built in a one-week hackathon. Students /ask in Discord (Japanese or English) and the bot answers from a LightRAG knowledge graph — graph + vector retrieval over 300+ documents (60 scraped intra pages plus ~250 staff Q&A pairs mined from Discord history). When it can't answer, it escalates to staff through paired threads and, on a single ✅, forwards the reply to the asker and live-ingests the new Q+A so the next ask hits it. /search login:<name> returns a bilingual card of exactly where a student is sitting, via the live 42 intra API.",
    tech: ["Python", "LightRAG", "Discord", "42 API"],
    highlights: ["LightRAG graph + vector retrieval over 300+ docs", "Self-healing: staff escalation → ✅ → live re-ingest", "Bilingual JP/EN with live campus-location lookup"],
  },
  {
    id: 3,
    slug: "options-pricing-engine",
    name: "Options Pricing Engine",
    link: "https://github.com/sakemyali/options-pricing",
    tagline: "C++17 Black-Scholes & Monte Carlo options engine",
    description: "A C++17 engine that prices European options under Black-Scholes two ways — closed-form and Monte Carlo — with both analytical and finite-difference Greeks, antithetic variance reduction, and a Newton-with-bisection-fallback implied-volatility solver. A CLI exposes price, a convergence sweep (MC standard error across N from 1K to 10M paths, plain vs antithetic, against the analytical price), and iv. Cross-validated against Hull's Options, Futures, and Other Derivatives (chapters 15, 19, 21), with a Catch2 test suite and an optional native ImGui visualizer.",
    tech: ["C++17", "Monte Carlo", "Catch2"],
    highlights: ["Closed-form + Monte Carlo with analytical & finite-diff Greeks", "Antithetic variance reduction; convergence swept to 10M paths", "Implied-vol solver; cross-checked vs Hull (Catch2)"],
  },
  {
    id: 4,
    slug: "japonette",
    name: "japonette",
    link: "https://github.com/sakemyali/japonette",
    tagline: "Open-source 42 API CLI on npm",
    description: "A TypeScript/Node CLI published to npm that wraps the 42 intra API so you can see who's on campus right now, look up any student's profile, and keep a personal friends watchlist — all read-only, straight from the terminal. A hosted OAuth broker makes browser login take about ten seconds with no API app to register, and a one-command cluster-install script bootstraps a modern Node (via nvm, no sudo) on locked-down 42 lab machines.",
    tech: ["TypeScript", "Node.js", "npm", "OAuth"],
    highlights: ["Published & versioned on npm (read-only 42 API)", "Hosted OAuth broker — ~10-second browser login", "Sudo-free cluster install via nvm bootstrap"],
  },
  {
    id: 5,
    slug: "fract-ol",
    name: "Fract-ol",
    link: "https://github.com/sakemyali/fract-ol",
    tagline: "Real-time fractal explorer in C",
    description: "An interactive fractal viewer written in C with the MiniLibX graphics library. It renders the Mandelbrot, Julia, and Burning Ship sets by computing per-pixel iteration counts and mapping them to color, with real-time zoom, pan, adjustable iteration depth, and color cycling. The Julia set takes its complex constant from the command line.",
    tech: ["C", "MiniLibX", "Mathematics"],
    highlights: ["Mandelbrot, Julia & Burning Ship sets", "Real-time zoom, pan & iteration control", "Per-pixel iteration-to-color mapping"],
  },
  {
    id: 6,
    slug: "amd-hackathon",
    name: "AMD Robotics Hackathon",
    link: "https://github.com/sakemyali/AMD_Hackathon_Paris2025",
    tagline: "Object-aware robot manipulation at AMD Paris 2025",
    description: "Built at the AMD Robotics Hackathon 2025 (AMD + HuggingFace). Trained a real SO-101 robot arm for object-aware manipulation — picking up a croissant and dipping it into a cup of coffee, ignoring non-target objects, and handing a baguette to a human. Two learning-based policies were explored with HuggingFace LeRobot: Action Chunking Transformers (ACT) for imitation learning, and vision-language-action models (π0, SmolVLA) for object selection and semantic grounding, trained from teleoperated demonstrations across three camera views.",
    tech: ["Python", "LeRobot", "Imitation Learning", "Robotics"],
    highlights: ["Object-aware manipulation on a real SO-101 arm", "ACT imitation learning + VLA models (π0, SmolVLA)", "Teleoperated demos across 3 camera views"],
  },
  {
    id: 7,
    slug: "minishell",
    name: "minishell",
    link: "https://github.com/sakemyali/minishell",
    tagline: "A bash-like shell in C",
    description: "A Unix shell written in C that parses and executes command lines with pipes, input/output redirections (<, >, >>, here-doc), environment-variable expansion, single- and double-quote handling, and signal management, alongside the core builtins (echo, cd, pwd, export, unset, env, exit).",
    tech: ["C", "Unix", "Processes"],
    highlights: ["Pipes, redirections & here-docs", "Env-var expansion + quote handling", "Builtins and signal handling"],
  },
  {
    id: 8,
    slug: "push-swap",
    name: "Push Swap",
    link: "https://github.com/sakemyali/push_swap",
    tagline: "Sorting with two stacks in minimal moves",
    description: "A C program that computes a short sequence of stack operations to sort a list of integers using two stacks and a limited instruction set (sa, pb, ra, rra, …). Stacks are linked-list based, with optimized routines for tiny stacks and full error handling on invalid input, duplicates, and overflow.",
    tech: ["C", "Algorithms", "Data Structures"],
    highlights: ["Two-stack sort with a limited op-set", "Optimized tiny-sort for ≤5 elements", "Robust input validation (dupes, overflow)"],
  },
  {
    id: 9,
    slug: "philosophers",
    name: "Dining Philosophers",
    link: "https://github.com/sakemyali/Philosopher",
    tagline: "Deadlock-free concurrency in C",
    description: "A multithreaded solution to the classic dining philosophers problem in C — POSIX threads with mutex-protected forks and microsecond-granularity timing to keep philosophers fed without starvation. Runs up to 500 concurrent philosophers sharing 500 mutexes with zero deadlocks and zero data races.",
    tech: ["C", "pthreads", "Concurrency"],
    highlights: ["Zero deadlocks / data races at 500 threads", "Microsecond-granularity scheduling", "Mutex-protected shared resources"],
  },
];

export const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    link: "https://github.com/sakemyali",
    color: "hover:text-white",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    link: "https://www.linkedin.com/in/emyali/",
    color: "hover:text-white",
  },
  {
    name: "Hugging Face",
    icon: Bot,
    link: "https://huggingface.co/sakemyali",
    color: "hover:text-white",
  },
  {
    name: "Email",
    icon: Mail,
    link: "mailto:myali.sakurai.elidrissi@gmail.com",
    color: "hover:text-white",
  },
];

export const experiences = [
  {
    title: "Backend & ML Engineer (Freelance)",
    company: "East Capital",
    period: "2026 — Present",
    desc: "Built data-acquisition pipelines — web scrapers across Japanese rental platforms with regional filtering, exposed via a RESTful API — and a property-price prediction model trained on multi-source Japanese market data.",
  },
  {
    title: "Backend Engineer Intern",
    company: "DIGITAL GRID Corporation",
    period: "Feb 2026 — Apr 2026",
    desc: "Built a customer-facing RAG system with LangGraph, combining hybrid vector search with knowledge-graph traversal. Lifted answer accuracy ~20% via automated evaluation and cut database query overhead ~70%. Delivered as a Dockerized service.",
  },
  {
    title: "Full Stack Engineering Intern",
    company: "Tokyo ICT (JICA)",
    period: "Jul 2023 — Oct 2023",
    desc: "Developed a multilingual speech conversion system using Azure Cognitive Services. Built scalable backend services with Django, Node.js, and PostgreSQL, reducing runtime by 30%.",
  },
  {
    title: "Junior Developer Intern",
    company: "Brando SARL",
    period: "Nov 2022 — Feb 2023",
    desc: "Developed responsive web applications using JavaScript and RESTful APIs. Collaborated using Agile methodologies and Git to deliver client-focused solutions within tight deadlines.",
  },
];

export const tools = [
  "Python & C – Backend Development",
  "AWS & Azure – Cloud Infrastructure",
  "Docker – Containerization",
  "Git & GitHub – Version Control",
  "LangGraph – Agentic LLM Orchestration",
];

export const hackathons = [
  {
    name: "{Tech: Europe} Paris AI Hackathon 2026",
    date: "2026",
    desc: "Sponsors: OpenAI, Lovable...",
  },
  {
    name: "AMD Robotics Hackathon Paris 2025",
    date: "2025",
    desc: "Sponsors: AMD, HuggingFace...",
  },
  {
    name: "iCHack 26",
    date: "2026",
    desc: "Sponsors: HRT, IMC, Citadel...",
  },
];

export const publications = [
  {
    title: "Integrating Machine Learning Fraud Detection and Hybrid Post-Quantum Cryptography in a Secure Trading Platform",
    authors: "Sakurai El Idrissi, M. A., Otuka, R., Nwajana, A.",
    venue: "Technologies (MDPI) — Special Issue: Disruptive Technologies: Big Data, AI, IoT, Games, and Mixed Reality",
    status: "Manuscript under review",
    desc: "Combines ML ensemble methods for financial fraud detection with hybrid post-quantum cryptographic protocols for secure trading infrastructure.",
    link: "",
  },
];

export const education = [
  {
    school: "The University of Edinburgh",
    degree: "MSc High Performance Computing",
    period: "Sep 2026 — Dec 2027",
    desc: "Incoming MSc at EPCC — parallel programming, HPC architectures, and large-scale scientific computing.",
  },
  {
    school: "42 Tokyo",
    degree: "Software Engineering Program",
    period: "2025 — Present",
    desc: "Ranked 1st place in the Piscine entrance exam. Peer-to-peer learning in C, algorithms, and systems programming.",
  },
  {
    school: "Sorbonne University",
    degree: "BSc Mathematics (online)",
    period: "Oct 2026 — Jun 2029",
    desc: "Strengthening mathematical foundations alongside engineering and research work.",
  },
  {
    school: "Nottingham Trent University",
    degree: "BSc Cyber Security — 1st Class Honours",
    period: "2022 — 2025",
    desc: "CS Project Prize. Focus on cryptography, penetration testing, and secure systems.",
  },
];

export const achievements = [
  {
    title: "1st Class Honours",
    value: "BSc",
    desc: "Graduated with 1st Class Honours in Cyber Security from Nottingham Trent University.",
  },
  {
    title: "42 Tokyo Piscine",
    value: "1st",
    desc: "Ranked 1st place in the 42 Tokyo entrance exam (Piscine).",
  },
  {
    title: "CS Project Prize",
    value: "NTU",
    desc: "Awarded the Department of Computer Science Project Prize in BSc Cyber Security.",
  },
];

export const skills = [
  {
    category: "Programming & Frameworks",
    skills: [
      "Python / C / C++ / Go",
      "Django / FastAPI",
      "SQL / LangGraph",
    ],
  },
  {
    category: "Cloud & Tools",
    skills: ["AWS / Azure / Firebase", "Docker / Git / GitHub", "REST APIs / ChromaDB"],
  },
  {
    category: "Cybersecurity & AI",
    skills: ["Pen Testing / Cryptography", "Post-Quantum Cryptography / Networking Security", "Generative AI / LLMs / RAG"],
  },
  {
    category: "Other",
    skills: ["Agile / DevSecOps", "Prompt Engineering", "Computer Vision"],
  },
];

export const techStack = [
  [
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" },
    { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
    { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
    { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
    { name: "Azure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg" },
  ],
  [
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
    { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" },
    { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg" },
    { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg" },
    { name: "LangGraph", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  ],
];

export const certificates = [
  "BSc Cyber Security – 1st Class Honours, NTU",
  "CS Project Prize – BSc Cyber Security, NTU",
  "1st Place – 42 Tokyo Piscine Entrance Exam",
];

export const languages = [
  { name: "English", level: "Full Professional" },
  { name: "French", level: "Advanced" },
  { name: "Arabic", level: "Intermediate" },
  { name: "Darija", level: "Native / Bilingual" },
  { name: "Japanese", level: "Advanced" },
];

export const currentlyLearning = [
  "C – Systems programming & memory safety",
  "Kubernetes – Container orchestration at scale",
  "Advanced RAG – Agentic retrieval & evaluation",
  "Quantum Computing – Gate-based models & algorithms",
  "Post-Quantum Cryptography – Lattice-based schemes",
];

export const githubUsername = "sakemyali";

export const accentThemes = [
  { name: "Mono", color: "#ffffff", rgb: "255, 255, 255" },
  { name: "Blue", color: "#60a5fa", rgb: "96, 165, 250" },
  { name: "Green", color: "#4ade80", rgb: "74, 222, 128" },
  { name: "Amber", color: "#fbbf24", rgb: "251, 191, 36" },
  { name: "Rose", color: "#fb7185", rgb: "251, 113, 133" },
];
