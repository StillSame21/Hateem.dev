/**
 * Résumé content for `/resume`. Transcribed from the source PDF
 * (Resume_Mohamad Hateem bin Nazamid.pdf).
 *
 * Project titles and stacks are deliberately NOT repeated here — they are
 * looked up by slug through `getProjects()` (src/lib/projects.ts) so this
 * page and Selected Work can never drift apart. Only the résumé-specific
 * bullets live in `RESUME_PROJECTS` below.
 *
 * Privacy: the source PDF prints a home address and phone number. Neither
 * appears on this public page — only email, LinkedIn, GitHub and a city-level
 * location, to keep the address and number off a scrapeable URL. The PDF
 * download (SITE.resumePdf) still carries the full contact block for the
 * applications actually sent out.
 */

export const TITLE_LINE =
  "Full-Stack Developer Intern · Software Engineer Intern · DevOps Intern";

export const SUMMARY_TEMPLATE = (window: string, length: string) =>
  `Motivated final-year Bachelor of Computer Science student with a CGPA of 3.88 and practical skills in web development, database design, and system integration. Experienced in Java, PHP, SQL, HTML, CSS and JavaScript through academic and final year projects. Strong in teamwork, adaptability, and problem solving. Seeking an internship placement as a Full-Stack Developer for the ${length} window from ${window}, to apply technical knowledge, improve development skills, and contribute to real-world software projects.`;

export type ResumeEducation = {
  institution: string;
  detail: string;
  range: string;
};

export const EDUCATION: ResumeEducation[] = [
  {
    institution: "Universiti Teknologi MARA (UiTM), Shah Alam",
    detail: "Bachelor of Computer Science | CGPA: 3.88 | Dean's Award",
    range: "2023 — Present",
  },
  {
    institution: "Universiti Teknologi MARA (UiTM), Dengkil",
    detail: "Foundation in Engineering | CGPA: 3.93",
    range: "2022 — 2023",
  },
  {
    institution: "SMK Seri Serdang",
    detail: "Sijil Pelajaran Malaysia (SPM) | 8A 2B",
    range: "2017 — 2021",
  },
];

/** Keyed by the project slug in src/content/projects/*.mdx. */
export const RESUME_PROJECTS: Record<
  string,
  { kind: string; year: string; bullets: string[] }
> = {
  "iw-cloudmasim": {
    kind: "Final Year Project",
    year: "2026",
    bullets: [
      "Developed a web interface to run and monitor cloud simulations.",
      "Integrated React frontend with FastAPI backend to display live metrics.",
    ],
  },
  cargo: {
    kind: "Academic Project",
    year: "2025",
    bullets: [
      "Developed a web-based car rental system to manage bookings, vehicles, customers, and payments.",
      "Designed and implemented MySQL database tables for booking records, user accounts, and payment details.",
    ],
  },
};

export const SKILLS = {
  softwareDevelopment: ["Java", "PHP", "C++", "HTML", "CSS", "React.js"],
  database: ["MySQL", "Oracle"],
  tools: ["GitHub", "Coding Agent"],
  basicExposure: ["FastAPI", "Python", "Dockerhub", "CI/CD"],
  soft: ["Team Collaboration", "Adaptability", "Problem Solving", "Time Management"],
} as const;

export type ResumeLanguage = { name: string; level: string };

export const LANGUAGES: ResumeLanguage[] = [
  { name: "Malay", level: "Native" },
  { name: "English", level: "Proficient" },
];

export type ResumeActivity = {
  title: string;
  detail?: string;
  bullets?: string[];
  range: string;
};

export const ACTIVITIES: ResumeActivity[] = [
  {
    title: "Korea-ASEAN Digital Academy Malaysia Track (Ongoing)",
    detail:
      "AI-enabled full-stack development training under a Korea-ASEAN digital talent initiative (NIPA, MDEC).",
    range: "Jun 2026 — Aug 2026",
  },
  {
    title: "SULAM International Webinar for Digital Ethics | Speaker",
    bullets: [
      'Delivered Session 2, "Digital Ethics 101: Ethics in AI for Higher Education."',
      "International audience, India University of 500+ participants.",
    ],
    range: "Jun 2026",
  },
];

export const REFERENCES_NOTE = "Available upon request.";
