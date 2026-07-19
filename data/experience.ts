/**
 * Your experience timeline and skill list.
 *
 * To add a job: copy a block and put it at the TOP of the array (newest first).
 * To remove one: delete its block, commas and all.
 * To edit: change the text between the quotes. Don't remove the quotes.
 */
export type Job = {
  /** mono eyebrow above the title, e.g. "2024 - PRESENT · PITTSBURGH" */
  period: string;
  /** e.g. "Ather Energy, Software Engineer" */
  title: string;
  /** one paragraph describing the work */
  body: string;
};

export const jobs: Job[] = [
  {
    period: "2024 - PRESENT · PITTSBURGH",
    title: "Carnegie Mellon University, Graduate Researcher",
    body: "LLM benchmarking for biological reasoning at xulab; RecoVR incubation; product research for Zippy, the world's smallest bipedal robot; CV capstone with Sheetz.",
  },
  {
    period: "2021 - 2024 · BANGALORE",
    title: "Ather Energy, Software Engineer",
    body: "Shipped ML and product on real electric scooters: pothole detection (92% accuracy) in the vehicle data stack, Ride Stories community app, and Ather Unlocked, a city-wide treasure-hunt PWA.",
  },
];

/** The "STACK OF CHOICE" chips. Add or remove entries freely. */
export const stack: string[] = [
  "Python",
  "PyTorch",
  "LLMs / RAG",
  "OpenCV",
  "React",
  "Flask",
  "Redis",
  "Firebase",
];
