/**
 * Your experience timeline and skill list.
 *
 * To add a job: copy a block and put it at the TOP of the array (newest first).
 * To remove one: delete its whole block, curly braces and trailing comma included.
 * To edit: change the text between the quotes, keeping the quotes.
 *
 * `bullets` is a list. Add or remove lines freely, each one needs quotes
 * and a comma at the end.
 */
export type Job = {
  /** mono eyebrow above the title, e.g. "OCT 2023 - NOV 2024 · BANGALORE" */
  period: string;
  /** organisation, e.g. "Ather Energy" */
  org: string;
  /** your role there, e.g. "Software Developer" */
  role: string;
  /** what you actually did, one string per bullet */
  bullets: string[];
};

export const jobs: Job[] = [
  {
    period: "FEB 2026 - PRESENT · PITTSBURGH",
    org: "Carnegie Mellon University",
    role: "Research Engineer (GenAI)",
    bullets: [
      "Fine-tuned a majority-voting ensemble of three domain-specialized LLMs on curated bio-imaging datasets; implemented consensus-based iterative training evaluated across 296 bioinformatics benchmarks, achieving a 25% accuracy improvement.",
      "Architected and deployed a custom 8B-param LLM with tool-calling for Cryo-Electron Tomography using PyTorch and transfer learning, automating cellular annotation that took researchers 8 hours of manual labeling per dataset.",
      "Built an async evaluation infrastructure with automated grading across bioinformatics benchmarks; optimized inference with batch processing and caching, cutting per-sample time from 45s to 12s (73% faster).",
    ],
  },
  {
    period: "MAY 2025 - AUG 2025 · MT. LAUREL, NJ",
    org: "Telvue Corporation",
    role: "Software Developer Intern",
    bullets: [
      "Created an event-driven push notification system using Rails microservices and Firebase Admin SDK with pub/sub triggers and retry logic, increasing mobile user engagement by 40% across 13K+ users.",
      "Led a 4-person cross-functional team (engineering, design, mobile) to unify notification UX across iOS and Android, reducing design to production integration time from 3 weeks to under 2 weeks.",
    ],
  },
  {
    period: "FEB 2023 - NOV 2024 · BANGALORE",
    org: "Ather Energy",
    role: "Software Developer",
    bullets: [
      "Architected a B2B fleet monitoring dashboard with real-time IoT telemetry (remote immobilizer, GPS, diagnostics) using React and Firebase, adopted by 3 enterprise clients managing 200+ vehicles.",
      "Engineered and shipped a full-stack PWA using Spring Boot (Java) and React Native for carbon-footprint tracking, serving 50K+ DAU and reducing end-to-end tracking latency by 25% through API response caching.",
      "Trained and deployed an ML pothole detection model (92% accuracy) using Python signal processing on accelerometer data, driving a 35% increase in safety-feature adoption across the rider base.",
      "Owned a cross-team test automation platform using Java and Flutter, increasing automated test coverage from 32% to 78% and cutting QA cycle time by 45% across 4 engineering squads.",
      "Streamlined 12 legacy Firebase Cloud Functions (Node.js) and built custom SQL automation scripts, reducing average API response time by 20% and data processing overhead by 10%.",
      "Developed 6 RESTful APIs in Spring Boot powering a favorite-locations feature for the Ather app (100K+ users), cutting location-search latency by 40% with indexed queries and Redis caching.",
      "Built a full-stack campaign PWA using React frontend and Java backend, enabling real-time user participation across 10+ cities and driving 25K+ campaign sign-ups in the first month.",
    ],
  },
];

/** The "STACK OF CHOICE" chips. Add or remove entries freely. */
export const stack: string[] = [
  "Python",
  "TypeScript",
  "React / Next.js",
  "React Native",
  "Java / Spring Boot",
  "Node.js",
  "Flask",
  "PyTorch",
  "TensorFlow",
  "LLM fine-tuning",
  "LangChain / RAG",
  "OpenCV",
  "Firebase",
  "AWS / GCP",
  "Docker",
  "PostgreSQL",
  "MongoDB",
  "Redis",
]
