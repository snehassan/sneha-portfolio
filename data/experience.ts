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
    role: "Graduate Researcher, GenAI",
    bullets: [
      "Fine-tuned a majority-voting ensemble of three domain-specialized LLMs on curated bio-imaging datasets, using consensus-based iterative training evaluated across 296 bioinformatics benchmarks for a 25% accuracy improvement.",
      "Architected and deployed a custom 8B-parameter LLM with tool-calling, plus async evaluation infrastructure with automated grading across bioinformatics benchmarks.",
    ],
  },
  {
    period: "MAY 2025 - AUG 2025 · MT. LAUREL, NJ",
    org: "Telvue Corporation",
    role: "Software Developer Intern",
    bullets: [
      "Created an event-driven push notification system using Rails microservices and the Firebase Admin SDK, with pub/sub triggers and retry logic, lifting mobile engagement 40% across 13K+ users.",
      "Led a 4-person cross-functional team across engineering, design and mobile to unify notification UX on iOS and Android, cutting design-to-production integration from 3 weeks to under 2.",
    ],
  },
  {
    period: "OCT 2023 - NOV 2024 · BANGALORE",
    org: "Ather Energy",
    role: "Software Developer",
    bullets: [
      "Architected a B2B fleet monitoring dashboard with real-time IoT telemetry (remote immobilizer, GPS, diagnostics) in React and Firebase, adopted by 3 enterprise clients managing 200+ vehicles.",
      "Shipped a full-stack carbon-footprint tracking PWA in Spring Boot and React Native serving 50K+ daily active users, cutting end-to-end tracking latency 25% with API response caching.",
      "Trained and deployed an ML pothole detection model at 92% accuracy using Python signal processing on accelerometer data, driving a 35% increase in safety-feature adoption.",
      "Owned a cross-team test automation platform in Java and Flutter, taking automated coverage from 32% to 78% and cutting QA cycle time 45% across 4 engineering squads.",
      "Streamlined 12 legacy Firebase Cloud Functions in Node.js and built custom SQL automation, reducing average API response time 20% and processing overhead 10%.",
    ],
  },
  {
    period: "FEB 2023 - OCT 2023 · BANGALORE",
    org: "Ather Energy",
    role: "Software Developer Intern",
    bullets: [
      "Developed 6 RESTful APIs in Spring Boot powering a favorite-locations feature for the Ather app (100K+ users), cutting location-search latency 40% with indexed queries and Redis caching.",
      "Built a full-stack campaign PWA with a React frontend and Java backend, enabling real-time participation across 10+ cities and driving 25K+ sign-ups in the first month.",
    ],
  },
];

/** The "STACK OF CHOICE" chips. Add or remove entries freely. */
export const stack: string[] = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "Java / Spring Boot",
  "Node.js",
  "PyTorch",
  "LLMs / RAG",
  "OpenCV",
  "Firebase",
  "PostgreSQL",
  "Redis",
];
