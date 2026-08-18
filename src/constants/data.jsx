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
    slug: "fract-ol",
    name: "Fract-ol",
    link: "https://github.com/sakemyali/fract-ol",
    tagline: "Real-time fractal explorer in C",
    description: "An interactive fractal rendering engine built in C using the MiniLibX graphics library. Renders Mandelbrot, Julia, and Burning Ship fractals with real-time zoom, color shifting, and smooth iteration coloring.",
    tech: ["C", "MiniLibX", "Mathematics"],
    highlights: ["Real-time zoom with mouse scroll", "Multiple fractal sets", "Psychedelic color palette cycling"],
  },
  {
    id: 3,
    slug: "push-swap",
    name: "Push Swap",
    link: "https://github.com/sakemyali/push_swap",
    tagline: "Optimized sorting with minimal operations",
    description: "A sorting algorithm project from 42 Tokyo that sorts a stack of integers using a limited set of operations (sa, sb, ra, rb, pa, pb, etc.) in the fewest moves possible.",
    tech: ["C", "Algorithms", "Data Structures"],
    highlights: ["Turk algorithm implementation", "Optimized for minimal operations", "Handles edge cases"],
  },
  {
    id: 4,
    slug: "minitalk",
    name: "Minitalk",
    link: "https://github.com/sakemyali/minitalk",
    tagline: "UNIX signal-based IPC",
    description: "A client-server communication program using UNIX signals (SIGUSR1 and SIGUSR2). Transmits strings between processes bit by bit with acknowledgment signals.",
    tech: ["C", "UNIX Signals", "IPC"],
    highlights: ["Bit-level data transmission", "Signal acknowledgment protocol", "Unicode support"],
  },
  {
    id: 5,
    slug: "amd-hackathon",
    name: "AMD Robotics Hackathon",
    link: "https://github.com/sakemyali/AMD_Hackathon_Paris2025",
    tagline: "Robotics + AI at AMD Paris 2025",
    description: "Developed at the AMD Robotics Hackathon in Paris, sponsored by AMD and HuggingFace. Focused on integrating AI capabilities with robotics hardware.",
    tech: ["Python", "HuggingFace", "Robotics"],
    highlights: ["AMD hardware integration", "AI model deployment", "Real-time processing"],
  },
  {
    id: 6,
    slug: "tech-europe-hack",
    name: "Tech Europe Hack 2026",
    link: "https://github.com/sakemyali/Tech-Europe_Hack2026",
    tagline: "AI hackathon with OpenAI & Lovable",
    description: "Built at the {Tech: Europe} Paris AI Hackathon 2026, sponsored by OpenAI and Lovable. A cutting-edge AI project developed in a competitive international environment.",
    tech: ["Python", "OpenAI API", "Cloud"],
    highlights: ["OpenAI API integration", "Rapid prototyping", "International competition"],
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
    title: "AI/ML Engineer Intern",
    company: "Dassault Systèmes",
    period: "Aug 2026 — Present",
    desc: "AI/ML engineering internship in Tokyo.",
  },
  {
    title: "Incoming Summer Intern",
    company: "Morgan Stanley",
    period: "Aug 2026 — Present",
    desc: "Institutional Equity Division — Sales & Trading, Tokyo.",
  },
  {
    title: "Backend/ML Engineer (Freelance)",
    company: "Stealth AI Startup",
    period: "May 2026 — Present",
    desc: "Built data-acquisition pipelines — web scrapers across Japanese rental platforms with regional filtering, exposed via a RESTful API — and a property-price prediction model trained on multi-source Japanese market data.",
  },
  {
    title: "Backend Engineer Intern",
    company: "DIGITAL GRID Corporation",
    period: "Feb 2026 — Apr 2026",
    desc: "Built a customer-facing RAG system with LangGraph, combining hybrid vector search with knowledge-graph traversal. Lifted answer accuracy ~20% via automated evaluation and cut database query overhead ~70%. Delivered as a Dockerized service.",
  },
  {
    title: "Full Stack Engineer Intern",
    company: "TOKYO-ICT (JICA affiliate)",
    period: "Jul 2023 — Sep 2023",
    desc: "Developed a multilingual speech conversion system using Azure Cognitive Services. Built scalable backend services with Django, Node.js, and PostgreSQL, reducing runtime by 30%.",
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
    title: "Quantifying Layered Security Overhead in Explainable ML Fraud Detection Systems",
    venue: "MDPI Technologies (special issue) — manuscript in submission",
    period: "2026",
    desc: "Measures the performance cost of defense-in-depth in an explainable fraud-detection service: STRIDE-modeled three-container architecture with a crypto-agile config layer, Isolation Forest anomaly pipeline with an /explain endpoint, and per-layer overhead benchmarks against published fraud-detection baselines.",
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
  { name: "Arabic", level: "Advanced" },
  { name: "Japanese", level: "Advanced" },
];

export const currentlyLearning = [
  "C – Systems programming & memory safety",
  "Quantum Computing – Post-quantum cryptography",
];

export const githubUsername = "sakemyali";

export const accentThemes = [
  { name: "Mono", color: "#ffffff", rgb: "255, 255, 255" },
  { name: "Blue", color: "#60a5fa", rgb: "96, 165, 250" },
  { name: "Green", color: "#4ade80", rgb: "74, 222, 128" },
  { name: "Amber", color: "#fbbf24", rgb: "251, 191, 36" },
  { name: "Rose", color: "#fb7185", rgb: "251, 113, 133" },
];
