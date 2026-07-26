/** Shared facts about me, so nothing is retyped across sections. */
export const SITE = {
  name: "Mohamad Hateem",
  fullName: "Mohamad Hateem bin Nazamid",
  domain: "hateem.dev",
  email: "hateemnaza@gmail.com",
  github: "https://github.com/StillSame21",
  githubHandle: "StillSame21",
  linkedin: "https://www.linkedin.com/in/mohamad-hateem-nazamid",
  repo: "https://github.com/StillSame21/hateem.dev",
  /** The canonical résumé — an HTML page, not the raw PDF. Browsers render a
   *  linked PDF inline in their own viewer, which mangles a Word export's
   *  fonts and layout; the page reuses the site's own tokens instead and
   *  prints cleanly via Ctrl-P. */
  resume: "/resume",
  /** The downloadable PDF, forced to `Content-Disposition: attachment` in
   *  next.config.ts so it never opens inline in a browser tab. */
  resumePdf: "/resume.pdf",
} as const;

/**
 * The upcoming placement window. Single source for the hero pill and the
 * availability card, so the two can never drift apart.
 *
 * TODO: Hateem — confirm `focus` matches what you actually want to be
 * offered for. Currently derived from the Toolkit groups (Python,
 * TypeScript, PHP, React, Next.js, FastAPI).
 */
export const PLACEMENT = {
  window: "Sept 2026 – Feb 2027",
  length: "6 Months",
  focus: "Full-Stack Developer, Software Engineer, DevOps",
  location: "Klang Valley, Malaysia",
  locationNote: "(On-site / Hybrid)",
  status: "Seeking Internship",
} as const;
