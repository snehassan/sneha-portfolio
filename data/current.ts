import data from "./current.json";

/**
 * "Currently working on" list, shown as a popup on the homepage and then
 * pinned at the bottom of the page.
 *
 * Edit it at /current/admin (commits current.json to GitHub, live in about a
 * minute), or hand-edit current.json directly.
 */
export type Current = {
  title: string;
  /** short mono label, e.g. BUILDING, RESEARCHING, WRITING, READING */
  status: string;
  /** one line on what it is or where it's at */
  note: string;
  /** optional link; leave "" for none. Site paths like /projects work too. */
  url: string;
};

export const current: Current[] = data as Current[];
