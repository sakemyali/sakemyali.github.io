import { Github, Linkedin, Mail, Bot } from "lucide-react";

export const personalInfo = {
  name: "Moulay Ali Sakurai El idrissi",
  role: "Backend Engineer intern",
  bio: "Backend engineer and Cybersecurity graduate based in Tokyo, Japan. I build secure, scalable systems with C, Python, and cloud technologies.",
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
    description: "Built at the Mistral AI Hackathon 2026. A real-time desktop assistant that monitors the screen and orchestrates four Mistral models in parallel (Pixtral-12B for OCR/vision, Ministral-3B for intent, Codestral for code help, Mistral Large for translation), with a Python/FastAPI backend and a transparent Electron + React overlay over WebSocket.",
    tech: ["Python", "FastAPI", "TypeScript", "React", "Electron", "Mistral"],
    highlights: ["4 Mistral models orchestrated in parallel", "3 concurrent inference pipelines + agent router", "Multilingual voice via ElevenLabs"],
  },
  {
    id: 2,
    slug: "42-knowledge-bot",
    name: "42 Knowledge Bot",
    link: "https://github.com/sakemyali/42-discord-bot",
    tagline: "RAG Discord bot for 42 Tokyo",
    description: "A Discord question-answering bot built in a one-week hackathon for 42 Tokyo students, using LightRAG (graph + vector retrieval) over a 300+ document knowledge base of intra pages and mined staff Q&A. A provider-agnostic LLM layer runs either a local model (Qwen2.5-7B via Ollama) or a hosted inference API (Llama-3.3-70B on Groq, or Gemini), with local sentence-transformer embeddings. Bilingual JP/EN.",
    tech: ["Python", "LightRAG", "Ollama", "Groq"],
    highlights: ["Graph + vector retrieval over 300+ docs", "Local or hosted LLM inference with fallback", "Commended by staff; 82% of surveyed students wanted it adopted"],
  },
  {
    id: 3,
    slug: "options-pricing-engine",
    name: "Options Pricing Engine",
    link: "https://github.com/sakemyali/options-pricing",
    tagline: "C++ Monte Carlo options engine",
    description: "A C++17 engine built for the IMC Prosperity trading competition. Prices European options in closed form (Black-Scholes) and by Monte Carlo (geometric Brownian motion with Box-Muller sampling), with antithetic variance reduction, Welford's online statistics, a convergence sweep to 10M paths against the 1/sqrt(N) line, and Greeks computed analytically and by finite differences; validated against Hull's textbook with ~290 Catch2 tests.",
    tech: ["C++", "Monte Carlo", "Catch2"],
    highlights: ["Antithetic variance reduction + Welford stability", "Convergence verified to 10M paths", "~290 tests, cross-checked vs Hull"],
  },
  {
    id: 4,
    slug: "japonette",
    name: "japonette",
    link: "https://github.com/sakemyali/japonette",
    tagline: "Open-source 42 API CLI on npm",
    description: "A TypeScript/Node CLI published to npm that wraps the 42 intra API, with a hosted OAuth broker so users authenticate in seconds with no app registration. Read-only commands for campus presence and profile lookup, actively maintained.",
    tech: ["TypeScript", "Node.js", "npm", "OAuth"],
    highlights: ["Published and maintained on npm", "Hosted OAuth broker for one-command login", "Used by fellow 42 students"],
  },
  {
    id: 5,
    slug: "fract-ol",
    name: "Fract-ol",
    link: "https://github.com/sakemyali/fract-ol",
    tagline: "Real-time fractal explorer in C",
    description: "An interactive fractal rendering engine built in C using the MiniLibX graphics library. Renders Mandelbrot, Julia, and Burning Ship fractals with real-time zoom, color shifting, and smooth iteration coloring.",
    tech: ["C", "MiniLibX", "Mathematics"],
    highlights: ["Real-time zoom with mouse scroll", "Multiple fractal sets", "Psychedelic color palette cycling"],
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

export const education = [
  {
    school: "42 Tokyo",
    degree: "Software Engineering Program",
    period: "2024 — Present",
    desc: "Ranked 1st place in the Piscine entrance exam. Peer-to-peer learning in C, algorithms, and systems programming.",
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
      "Python / C / C++",
      "Django / Celery",
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
