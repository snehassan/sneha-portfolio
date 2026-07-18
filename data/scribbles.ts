import data from "./scribbles.json";

/**
 * "Links I'm into" feed.
 *
 * The data lives in `scribbles.json` so it can be edited from the UI at
 * /scribbles/admin, which commits the file back to GitHub and triggers a
 * redeploy. You can still hand-edit the JSON directly if you prefer.
 */
export type Scribble = {
  title: string;
  url: string;
  /** short mono label, e.g. READING, WATCHING, TOOL, PAPER */
  tag: string;
  /** your one-line take */
  note: string;
  /** free-form, e.g. "Jul 2026" */
  date: string;
};

export const scribbles: Scribble[] = data as Scribble[];
