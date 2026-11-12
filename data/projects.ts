/**
 * Every project card on /projects (and the overfitting lab) reads from here.
 *
 * To add one: copy a block, keep the quotes and trailing commas.
 * `link` is null when there's no public repo or write-up yet.
 * `shadow` picks the card's pastel shadow: lavender, blue, peach, mint, pink or gray.
 */
export type Project = {
  slug: string;
  title: string;
  kind: "Research" | "Industry" | "Founder" | "Side project" | "Product research";
  org: string;
  /** the one-line headline result shown in bold */
  result: string;
  body: string;
  tags: string[];
  link: string | null;
  img: string;
  alt: string;
  shadow: "lavender" | "blue" | "peach" | "mint" | "pink" | "gray";
  featured?: boolean;
  /** extra words the overfitting lab uses to match visitor questions */
  keywords: string[];
};

export const projects: Project[] = [
  {
    slug: "biosemantic-bridge",
    title: "BioSemantic Bridge",
    kind: "Research",
    org: "CMU xulab",
    result: "205 BixBench questions, multi-agent decoder",
    body: "Benchmarking bio-domain LLMs on BixBench with a multi-agent ensemble decoder architecture, supervised by Runmin Jiang at CMU's xulab.",
    tags: ["Python", "LLMs", "Bioinformatics"],
    link: "https://github.com/snehassan/bioexpert",
    img: "/images/biosemantic.svg",
    alt: "BioSemantic Bridge, multi-agent LLM benchmarking for biology at CMU xulab",
    shadow: "lavender",
    featured: true,
    keywords: ["biology", "benchmark", "llm", "agents", "ensemble", "research"],
  },
  {
    slug: "pothole-detection",
    title: "Pothole Detection",
    kind: "Industry",
    org: "Ather Energy",
    result: "92% accuracy · +35% safety-feature adoption",
    body: "ML pipeline detecting potholes from road sensor and camera data, deployed in Ather's vehicle data infrastructure.",
    tags: ["Python", "CV", "ML"],
    link: null,
    img: "/images/pothole.svg",
    alt: "Pothole detection pipeline built at Ather Energy",
    shadow: "peach",
    keywords: ["pothole", "road", "bump", "vibration", "scooter", "sensor", "accelerometer", "camera"],
  },
  {
    slug: "socratic-tutor",
    title: "Socratic LLM Tutor",
    kind: "Side project",
    org: "Open source",
    result: "Tiered hints instead of answers",
    body: "AI tutor that guides learners with tiered hints instead of handing over answers. Flask and Redis sessions, Anthropic API, React frontend.",
    tags: ["Flask", "Redis", "React"],
    link: "https://github.com/snehassan/socratic-llm",
    img: "/images/socratic.svg",
    alt: "Socratic LLM Tutor, pedagogical AI that guides with tiered hints",
    shadow: "blue",
    keywords: ["tutor", "teach", "learn", "homework", "student", "hint", "education"],
  },
  {
    slug: "recovr",
    title: "RecoVR",
    kind: "Founder",
    org: "Incubated at CMU",
    result: "VR rehab platform, incubated at Carnegie Mellon",
    body: "VR assistive-therapy platform for physical rehabilitation, which I founded and which is incubated at Carnegie Mellon University.",
    tags: ["Unity", "Blender", "Python"],
    link: "https://github.com/snehassan/RecoVR",
    img: "/images/recovr.jpg",
    alt: "RecoVR in-headset view of a mobility rehabilitation task",
    shadow: "mint",
    keywords: ["vr", "virtual", "rehab", "therapy", "physio", "health", "headset"],
  },
  {
    slug: "daily-os",
    title: "Daily OS",
    kind: "Side project",
    org: "Open source",
    result: "Recovery-aware scheduling, installable PWA",
    body: "Pulls your Whoop recovery score, HRV and wake time, then picks and time-shifts the right schedule for the day. Installable PWA with a full schedule editor.",
    tags: ["TypeScript", "Next.js", "Whoop API"],
    link: "https://github.com/snehassan/daily-os",
    img: "/images/daily-os.svg",
    alt: "Daily OS, recovery-aware scheduling driven by Whoop data",
    shadow: "lavender",
    keywords: ["sleep", "schedule", "calendar", "whoop", "recovery", "day", "plan"],
  },
  {
    slug: "youjam",
    title: "YouJam",
    kind: "Side project",
    org: "Open source",
    result: "YouTube in sync across friends",
    body: "Chrome extension that keeps YouTube playback in sync across friends, Spotify-Jam style. Anyone can play, pause or seek and everyone follows. MV3 with Firebase Realtime Database.",
    tags: ["JavaScript", "Chrome MV3", "Firebase"],
    link: "https://github.com/snehassan/YouJam",
    img: "/images/youjam.svg",
    alt: "YouJam, watching YouTube in sync with friends",
    shadow: "peach",
    keywords: ["youtube", "video", "sync", "friends", "watch", "together", "extension"],
  },
  {
    slug: "zippy",
    title: "Zippy",
    kind: "Product research",
    org: "Robotics",
    result: "The world's smallest bipedal robot",
    body: "Product research and feasibility for the world's smallest bipedal robot: sensitivity analysis, market research, technical viability.",
    tags: ["Product", "Robotics"],
    link: null,
    img: "/images/zippy2.jpg",
    alt: "Zippy, the world's smallest bipedal robot, beside a LEGO minifigure for scale",
    shadow: "pink",
    keywords: ["robot", "walk", "bipedal", "small", "tiny", "hardware"],
  },
];

/** Smaller things, listed on the archive card. */
export const archive: { title: string; note: string }[] = [
  { title: "Ather Unlocked", note: "city-wide treasure-hunt PWA for riders" },
  { title: "Ride Stories", note: "ride details and EV community stats" },
  { title: "Sheetz Cooler Optimization", note: "confidential CV restocking system" },
];
