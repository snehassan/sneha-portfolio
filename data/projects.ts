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
  kind: "Research" | "Industry" | "Founder" | "Side project" | "Product research" | "Product";
  org: string;
  /** the one-line headline result shown in bold */
  result: string;
  body: string;
  tags: string[];
  link: string | null;
  /** image path; leave empty ("") for a patterned placeholder */
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
    body: "Scooters shake all the time, so I taught one to tell a pothole from an ordinary bump using nothing but its accelerometer. Python signal processing feeding an ML model, deployed across Ather's rider base, where adoption of the safety features it powers climbed 35%.",
    tags: ["Python", "Signal processing", "ML"],
    link: null,
    img: "/images/pothole.svg",
    alt: "Pothole detection model built at Ather Energy",
    shadow: "peach",
    keywords: ["pothole", "road", "bump", "vibration", "scooter", "sensor", "accelerometer", "safety"],
  },

  {
    slug: "socratic-tutor",
    title: "Socratic LLM Tutor",
    kind: "Side project",
    org: "Technical pedagogy",
    result: "85% less answer-dumping · 30-user pilot",
    body: "A tutor that refuses to hand over the answer. I fine-tuned a foundation LLM with custom NLP guardrails so it nudges with Socratic hints instead, then wrapped it in a React and Flask app that replies in under 2 seconds.",
    tags: ["LLM fine-tuning", "NLP", "React", "Flask"],
    link: "https://github.com/snehassan/socratic-llm",
    img: "/images/socratic.svg",
    alt: "Socratic LLM Tutor, a tutor that guides with hints instead of answers",
    shadow: "blue",
    keywords: ["tutor", "teach", "learn", "homework", "student", "hint", "education", "answer"],
  },

  {
    slug: "recovr",
    title: "RecoVR",
    kind: "Founder",
    org: "Incubated by CMU",
    result: "+40% fitness outcomes · 20-patient pilot",
    body: "Physio homework you actually want to do. A Unity VR app with custom scripting and positional tracking that beat traditional home exercises by 40% on patient fitness outcomes in a 20-patient pilot. I founded it and build it, and Carnegie Mellon incubates it.",
    tags: ["Unity", "VR", "Positional tracking"],
    link: "https://github.com/snehassan/RecoVR",
    img: "/images/recovr.jpg",
    alt: "RecoVR in-headset view of a mobility rehabilitation task",
    shadow: "mint",
    keywords: ["vr", "virtual", "rehab", "therapy", "physio", "health", "headset", "exercise", "patient"],
  },  {
    slug: "vending-analytics",
    title: "Vending Analytics",
    kind: "Industry",
    org: "Sheetz",
    result: "94% accuracy · stockouts handled 60% faster",
    body: "A camera that notices when a vending slot goes empty before a customer does. A Python, OpenCV and TensorFlow pipeline spots the gaps at 94% accuracy and feeds a React dashboard, so restocking teams respond to stockouts 60% faster.",
    tags: ["Python", "OpenCV", "TensorFlow", "React"],
    link: null,
    img: "",
    alt: "Vending Analytics",
    shadow: "gray",
    keywords: ["vending", "camera", "empty", "stock", "restock", "retail", "vision", "shelf"],
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
    slug: "ride-stories",
    title: "Ride Stories",
    kind: "Product",
    org: "Ather Energy",
    result: "Ride details and EV community stats",
    body: "Ride details for every trip, plus stats from the wider EV community, built for Ather riders.",
    tags: ["EV", "Community"],
    link: null,
    img: "",
    alt: "Ride Stories",
    shadow: "blue",
    keywords: ["ride", "trip", "stats", "community", "ev", "electric", "rider"],
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
];

/** Smaller things, listed on the archive card. */
export const archive: { title: string; note: string }[] = [
  { title: "Ather Unlocked", note: "city-wide treasure-hunt PWA for riders" },
  { title: "Minnal Murali", note: "third-person Unity game with behavior-tree enemy AI, dynamic difficulty and photogrammetry-built worlds; I led it as my undergrad capstone" },
];
