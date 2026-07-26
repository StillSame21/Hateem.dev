import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Project content lives in `src/content/projects/*.mdx`, one file per project.
 * The homepage reads the frontmatter at build time, so the copy shown in
 * Selected work and the copy on the (not yet built) case study pages can never
 * drift apart. Add a project by adding a file — see the README.
 */
export type Project = {
  /** Derived from the filename, so it is always the URL segment. */
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  metrics: string[];
  cover: string;
  coverAlt: string;
  /** Optional caveat shown under the links, e.g. free-hosting cold starts. */
  note?: string;
  featured: boolean;
  order: number;
  /** MDX body, for the case study pages when they exist. */
  body: string;
};

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");

function asStringArray(value: unknown, file: string, field: string): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((v) => typeof v !== "string")) {
    throw new Error(`${file}: frontmatter "${field}" must be a list of strings`);
  }
  return value as string[];
}

function readProject(filename: string): Project {
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.mdx?$/, "");

  for (const field of ["title", "tagline", "cover"] as const) {
    if (typeof data[field] !== "string") {
      throw new Error(`${filename}: frontmatter "${field}" is required`);
    }
  }

  return {
    slug,
    title: data.title as string,
    tagline: data.tagline as string,
    stack: asStringArray(data.stack, filename, "stack"),
    metrics: asStringArray(data.metrics, filename, "metrics"),
    cover: data.cover as string,
    coverAlt: typeof data.coverAlt === "string" ? data.coverAlt : "",
    note: typeof data.note === "string" ? data.note : undefined,
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
