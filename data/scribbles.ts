/**
 * "Links I'm into" — your scribbles feed.
 *
 * To add a scribble: copy a block, put it at the TOP of the array,
 * and fill in the fields. `tag` is a short mono label (e.g. READING,
 * WATCHING, TOOL, PAPER). `note` is your one-line take. That's it —
 * the page updates on the next build/refresh.
 */
export type Scribble = {
  title: string;
  url: string;
  tag: string;
  note: string;
  date: string; // free-form, e.g. "Jul 2026"
};

export const scribbles: Scribble[] = [
  {
    title: "The Bitter Lesson — Rich Sutton",
    url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html",
    tag: "READING",
    note: "Re-read this every few months. Compute + general methods beat clever hand-crafted ones. Keeps me humble about my own 'clever' pipelines.",
    date: "Jul 2026",
  },
  {
    title: "How to do great research — Julia Galef / misc notes",
    url: "https://www.youtube.com/@juliagalef",
    tag: "WATCHING",
    note: "On staying calibrated and actually updating on evidence. Relevant when a benchmark result surprises you and you want to explain it away.",
    date: "Jun 2026",
  },
  {
    title: "Excalidraw",
    url: "https://excalidraw.com",
    tag: "TOOL",
    note: "Where every architecture diagram and half-baked idea starts. The hand-drawn look somehow makes it okay for things to be wrong.",
    date: "May 2026",
  },
  {
    title: "BixBench: benchmarking bioinformatics agents",
    url: "https://arxiv.org/abs/2503.00096",
    tag: "PAPER",
    note: "The benchmark behind a lot of my xulab work. Notes on why bio reasoning is a genuinely different beast from generic QA.",
    date: "Apr 2026",
  },
  {
    title: "Nicky Case — explorable explanations",
    url: "https://ncase.me",
    tag: "PLAYING",
    note: "Interactive essays that teach systems by letting you poke them. The north star for how I wish more ML papers were presented.",
    date: "Mar 2026",
  },
];
