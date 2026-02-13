import { Github, Linkedin, Mail, Bot } from "lucide-react";

export const personalInfo = {
  name: "Moulay Ali Sakurai El idrissi",
  role: "Backend Engineer intern",
  bio: "Backend engineer and Cybersecurity graduate based in Tokyo, Japan. I build secure, scalable systems with C, Python, and cloud technologies.",
  email: "myali.sakurai.elidrissi@gmail.com",
  location: "Japan",
};

export const projects = [
  { id: 1, link: "https://github.com/sakemyali/fract-ol" },
  { id: 2, link: "https://github.com/sakemyali/ichack26" },
  { id: 3, link: "https://github.com/sakemyali/push_swap" },
  { id: 4, link: "https://github.com/sakemyali/minitalk" },
  { id: 5, link: "https://github.com/sakemyali/AMD_Hackathon_Paris2025" },
  { id: 6, link: "https://github.com/sakemyali/Tech-Europe_Hack2026" },
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
    title: "Backend Engineer Intern",
    company: "DIGITAL GRID Corporation",
    period: "Feb 2026 — Present",
    desc: "Engineered a privacy-first RAG system using LangChain and locally hosted Llama 3. Improved context precision by ~20% with RAGAS evaluation and semantic re-ranking. Delivered a fully containerized MVP using Docker.",
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
  "LangChain – LLM Orchestration",
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
    degree: "Software Engineering",
    period: "2024 — Present",
    desc: "Ranked 1st place in the Piscine entrance exam. Peer-to-peer learning in C, algorithms, and systems programming.",
  },
  {
    school: "Nottingham Trent University",
    degree: "BSc Cyber Security — 1st Class Honours",
    period: "2021 — 2024",
    desc: "CS Project Prize & Outstanding Performance Prize. Focus on cryptography, penetration testing, and secure systems.",
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
  {
    title: "Outstanding Performance",
    value: "NTU",
    desc: "Received the Department of Computer Science Prize for Outstanding Performance.",
  },
];

export const skills = [
  {
    category: "Programming & Frameworks",
    skills: [
      "Python / C / C++",
      "Django / Celery",
      "SQL / LangChain",
    ],
  },
  {
    category: "Cloud & Tools",
    skills: ["AWS / Azure / Firebase", "Docker / Git / GitHub", "REST APIs / ChromaDB"],
  },
  {
    category: "Cybersecurity & AI",
    skills: ["Pen Testing / Cryptography", "Quantum Encryption / Networking Security", "Generative AI / LLMs / RAG"],
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
    { name: "LangChain", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  ],
];

export const certificates = [
  "BSc Cyber Security – 1st Class Honours, NTU",
  "CS Project Prize – BSc Cyber Security, NTU",
  "Outstanding Performance Prize – CS Dept, NTU",
  "1st Place – 42 Tokyo Piscine Entrance Exam",
];
