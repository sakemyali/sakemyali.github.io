import { Github, Linkedin, Bot } from "lucide-react";

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
    repo: "sakemyali/fract-ol",
    tagline: "Real-time fractal explorer in C",
    description: "An interactive fractal rendering engine built in C using the MiniLibX graphics library. Renders Mandelbrot, Julia, and Burning Ship fractals with real-time zoom, color shifting, and smooth iteration coloring.",
    tech: ["C", "MiniLibX", "Mathematics"],
    highlights: ["Real-time zoom with mouse scroll", "Multiple fractal sets", "Psychedelic color palette cycling"],
    sections: [
      {
        title: "How it works",
        body: "Every pixel maps to a point on the complex plane; the renderer iterates z ← z² + c until escape and maps the iteration count to a color. Event handlers mutate the viewport (center, scale, iteration cap) and trigger a full redraw, so zooming is just shrinking the sampled region around the cursor.",
      },
      {
        title: "What was hard",
        body: "Deep zooms stress numerical stability — double precision runs out of resolution and the image pixelates, so the iteration cap and escape radius had to be tuned to keep frames interactive without visible banding. Julia parameters come in as program arguments, which meant robust argv parsing before any graphics context exists.",
      },
    ],
  },
  {
    id: 3,
    slug: "push-swap",
    name: "Push Swap",
    link: "https://github.com/sakemyali/push_swap",
    repo: "sakemyali/push_swap",
    tagline: "Optimized sorting with minimal operations",
    description: "A sorting algorithm project from 42 Tokyo: given integers on the command line, it emits the shortest sequence of stack operations (sa, pb, ra, rrr…) that sorts them across two stacks. The program plans the sort — it never executes it.",
    tech: ["C", "Algorithms", "Data Structures"],
    highlights: ["Turk algorithm implementation", "Optimized for minimal operations", "Handles edge cases"],
    sections: [
      {
        title: "The constraint",
        body: "Only eleven operations exist — swaps, pushes, rotates, and reverse-rotates on two stacks — and the grade depends on how few you emit. Sorting 100 numbers in under 700 moves and 500 in under 5500 forces you past naive approaches into cost modeling: for each candidate move, compute the cheapest combined rotation of both stacks and pick the global minimum.",
      },
      {
        title: "Why it matters",
        body: "It's an exercise in optimizing against a cost function rather than reaching for a textbook sort — closer to instruction scheduling than to quicksort. The output is a verifiable program: any checker can replay the emitted operations and confirm the stack ends sorted.",
      },
    ],
  },
  {
    id: 4,
    slug: "minitalk",
    name: "Minitalk",
    link: "https://github.com/sakemyali/minitalk",
    repo: "sakemyali/minitalk",
    tagline: "UNIX signal-based IPC",
    description: "A client-server communication program using only UNIX signals (SIGUSR1 and SIGUSR2). The client encodes each character bit by bit into signals; the server reassembles them, prints, and acknowledges every bit back.",
    tech: ["C", "UNIX Signals", "IPC"],
    highlights: ["Bit-level data transmission", "Signal acknowledgment protocol", "Unicode support"],
    sections: [
      {
        title: "How it works",
        body: "Signals carry no payload, so the message becomes the timing: SIGUSR1 for a 0 bit, SIGUSR2 for a 1, eight signals per byte. The server installs handlers with sigaction and SA_SIGINFO to identify the sending PID and acknowledges each bit so the client never outruns the receiver — signals are not queued, and an unacknowledged burst silently drops data.",
      },
      {
        title: "What it teaches",
        body: "This is systems programming at its most exposed: async-signal-safety (almost nothing is safe to call in a handler), race conditions between kill and sigsuspend, and designing a reliable protocol over an unreliable, payload-less channel. Multibyte UTF-8 characters arrive intact because the protocol works below the character level.",
      },
    ],
  },
  {
    id: 5,
    slug: "amd-hackathon",
    name: "KACM — Robot Manipulation",
    link: "https://github.com/sakemyali/AMD_Hackathon_Paris2025",
    repo: "sakemyali/AMD_Hackathon_Paris2025",
    tagline: "A real robot picks up a croissant and dips it in coffee",
    description: "Team KACM's entry to the AMD Robotics Hackathon Paris 2025, sponsored by AMD and Hugging Face. We trained a physical robot arm for object-aware manipulation in a household scene: pick up a croissant, dip it in coffee, ignore distractor objects, and hand a baguette safely to a human.",
    tech: ["LeRobot", "Imitation Learning", "VLA Models"],
    highlights: ["Real hardware, not simulation", "ACT (Action Chunking Transformers) for imitation learning", "Vision-Language-Action models (π0, SmolVLA) for semantic grounding"],
    sections: [
      {
        title: "Two policies, compared",
        body: "We trained two learning-based policies independently on the LeRobot framework and compared them: ACT, an imitation-learning transformer that chunks action sequences from teleoperated demonstrations, and Vision-Language-Action models (π0, SmolVLA) that ground object selection in language — which is what lets the robot ignore non-target objects instead of grabbing whatever is closest.",
      },
      {
        title: "Why it was hard",
        body: "Hackathon robotics means every demo you record eats the clock, the lighting changes between training and judging, and a policy that overfits your teleoperation style fails on stage. Careful task decomposition — grasp, transport, dip, hand-over — kept each sub-behavior trainable from the small demonstration budget a weekend allows.",
      },
    ],
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

export const languages = [
  { name: "English", level: "Full Professional" },
  { name: "French", level: "Advanced" },
  { name: "Arabic", level: "Advanced" },
  { name: "Japanese", level: "Advanced" },
];

// TODO(ali): fill in — seeded from what the site used to list under "currently learning"
export const interests = [
  { title: "Systems programming", desc: "C, memory safety, and what the compiler actually emits." },
  { title: "Post-quantum cryptography", desc: "Crypto-agile designs that survive the migration." },
];
