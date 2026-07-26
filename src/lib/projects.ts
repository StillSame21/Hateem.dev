import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Project content lives in `src/content/projects/*.mdx`, one file per project.
 * The homepage reads the frontmatter at build time, so the copy shown in
 * Selected work and the copy on the (not yet built) case study pages can never
 * drift apart. Add a project by adding a file — see the README.
 */
export type ProjectShot = {
  src: string;
  alt: string;
};

export type Project = {
  /** Derived from the filename, so it is always the URL segment. */
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  metrics: string[];
  /** 1-3 screenshots, side-scrollable in Selected work (ProjectShots.tsx). */
  shots: ProjectShot[];
  /** The first shot's src — a single canonical image for places (OG tags,
   *  future case study pages) that want one, not a gallery. */
  cover: string;
  /** Optional caveat shown under the links, e.g. free-hosting cold starts. */
  note?: string;
  /** Optional live demo URL, rendered as a link next to the case study link. */
  demoUrl?: string;
  featured: boolean;
  order: number;
  /** MDX body, for the case study pages when they exist. */
  body: string;
};

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_SHOTS = 3;

function asStringArray(value: unknown, file: string, field: string): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((v) => typeof v !== "string")) {
    throw new Error(`${file}: frontmatter "${field}" must be a list of strings`);
  }
  return value as string[];
}

/**
 * Validated at build time — same server-only read this file already does for
 * the MDX itself — so a typo'd filename or a missing alt fails the build
 * instead of shipping a broken image or an inaccessible carousel.
 */
function asShotArray(value: unknown, file: string): ProjectShot[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${file}: frontmatter "shots" must be a non-empty list`);
  }
  if (value.length > MAX_SHOTS) {
    throw new Error(
      `${file}: frontmatter "shots" has ${value.length} entries, max is ${MAX_SHOTS}`,
    );
  }

  return value.map((entry, index) => {
    if (
      typeof entry !== "object" ||
      entry === null ||
      typeof (entry as { src?: unknown }).src !== "string" ||
      typeof (entry as { alt?: unknown }).alt !== "string"
    ) {
      throw new Error(
        `${file}: shots[${index}] must be { src: string, alt: string }`,
      );
    }

    const { src, alt } = entry as ProjectShot;

    if (alt.trim() === "") {
      throw new Error(`${file}: shots[${index}].alt must not be empty`);
    }

    const onDisk = path.join(PUBLIC_DIR, src);
    if (!fs.existsSync(onDisk)) {
      throw new Error(`${file}: shots[${index}].src "${src}" has no file at public${src}`);
    }

    return { src, alt };
  });
}

function readProject(filename: string): Project {
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.mdx?$/, "");

  for (const field of ["title", "tagline"] as const) {
    if (typeof data[field] !== "string") {
      throw new Error(`${filename}: frontmatter "${field}" is required`);
    }
  }

  const shots = asShotArray(data.shots, filename);

  return {
    slug,
    title: data.title as string,
    tagline: data.tagline as string,
    stack: asStringArray(data.stack, filename, "stack"),
    metrics: asStringArray(data.metrics, filename, "metrics"),
    shots,
    cover: shots[0].src,
    note: typeof data.note === "string" ? data.note : undefined,
    demoUrl: typeof data.demoUrl === "string" ? data.demoUrl : undefined,
    featured: data.featured === true,
    order: typeof data.order === "number" ? data.order : 99,
    body: content.trim(),
  };
}

/** All projects, ordered by the `order` field then title. */
export function getProjects(): Project[] {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(readProject)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
