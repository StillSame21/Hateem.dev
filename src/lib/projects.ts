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

/**
 * Optional. When present, ProjectShots.tsx renders it as slide 0 ahead of
 * `shots` — a poster image behind a play button, with no <video> element
 * mounted until the visitor clicks. Keeps the video's bytes off the initial
 * page load entirely.
 */
export type ProjectVideo = {
  src: string;
  poster: string;
  alt: string;
  /** e.g. "0:57" — shown on the play facade so the click is informed. */
  duration: string;
};

/**
 * Inline expandable panel on the project card. Optional — a project with no
 * `details` in its frontmatter renders no toggle at all (see ProjectDetails.tsx
 * and SelectedWork.tsx).
 */
export type ProjectDetails = {
  /** 1-3 short bullets. */
  problem: string[];
  /** 3-4 concrete bullets, up to MAX_BUILT_ITEMS. */
  built: string[];
  /** 2-4 short bullets on a single real technical challenge. */
  hardPart: string[];
  /** Optional one-line addendum to the stack chips above. */
  stackNotes?: string;
  /** Optional repo link, rendered under the panel. */
  repoUrl?: string;
};

export type Project = {
  /** Derived from the filename, so it is always the URL segment. */
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  metrics: string[];
  /** 1-4 screenshots, side-scrollable in Selected work (ProjectShots.tsx). */
  shots: ProjectShot[];
  /** Optional demo clip, shown as slide 0 ahead of `shots`. */
  demoVideo?: ProjectVideo;
  /** The first shot's src — a single canonical image for places (OG tags,
   *  future case study pages) that want one, not a gallery. */
  cover: string;
  /** Optional caveat shown under the links, e.g. free-hosting cold starts. */
  note?: string;
  /** Optional live demo URL, rendered as a link next to the case study link. */
  demoUrl?: string;
  /** Optional inline "Details" panel content — see ProjectDetails type above. */
  details?: ProjectDetails;
  featured: boolean;
  order: number;
  /** MDX body, for the case study pages when they exist. */
  body: string;
};

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_SHOTS = 4;
const MAX_BUILT_ITEMS = 4;

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

/**
 * Optional — `undefined` in the frontmatter means `undefined` out, which is
 * how ProjectShots knows to render the plain single-image/gallery path with
 * no video slide at all. Present-but-malformed still throws at build time,
 * same as `asShotArray` above, including the on-disk check for both `src`
 * and `poster` so a typo'd filename fails the build instead of shipping a
 * broken play button.
 */
function asDemoVideo(value: unknown, file: string): ProjectVideo | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "object" || value === null) {
    throw new Error(`${file}: frontmatter "demoVideo" must be an object`);
  }

  const data = value as Record<string, unknown>;

  for (const field of ["src", "poster", "alt", "duration"] as const) {
    if (typeof data[field] !== "string" || (data[field] as string).trim() === "") {
      throw new Error(`${file}: demoVideo.${field} must be a non-empty string`);
    }
  }

  const { src, poster, alt, duration } = data as {
    src: string;
    poster: string;
    alt: string;
    duration: string;
  };

  for (const [field, value] of [
    ["src", src],
    ["poster", poster],
  ] as const) {
    if (!fs.existsSync(path.join(PUBLIC_DIR, value))) {
      throw new Error(`${file}: demoVideo.${field} "${value}" has no file at public${value}`);
    }
  }

  return { src, poster, alt, duration };
}

/**
 * Optional — `undefined` in the frontmatter means `undefined` out, which is
 * how ProjectDetails/SelectedWork know to hide the toggle entirely rather
 * than render an empty panel. Present-but-malformed still throws at build
 * time, same as every other field here.
 */
function asDetails(value: unknown, file: string): ProjectDetails | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "object" || value === null) {
    throw new Error(`${file}: frontmatter "details" must be an object`);
  }

  const data = value as Record<string, unknown>;

  const problem = asStringArray(data.problem, file, "details.problem");
  if (problem.length === 0) {
    throw new Error(`${file}: details.problem must be a non-empty list`);
  }

  const hardPart = asStringArray(data.hardPart, file, "details.hardPart");
  if (hardPart.length === 0) {
    throw new Error(`${file}: details.hardPart must be a non-empty list`);
  }

  const built = asStringArray(data.built, file, "details.built");
  if (built.length === 0) {
    throw new Error(`${file}: details.built must be a non-empty list`);
  }
  if (built.length > MAX_BUILT_ITEMS) {
    throw new Error(
      `${file}: details.built has ${built.length} entries, max is ${MAX_BUILT_ITEMS}`,
    );
  }

  for (const field of ["stackNotes", "repoUrl"] as const) {
    if (data[field] !== undefined && typeof data[field] !== "string") {
      throw new Error(`${file}: details.${field} must be a string if present`);
    }
  }

  return {
    problem,
    built,
    hardPart,
    stackNotes: typeof data.stackNotes === "string" ? data.stackNotes : undefined,
    repoUrl: typeof data.repoUrl === "string" ? data.repoUrl : undefined,
  };
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
    demoVideo: asDemoVideo(data.demoVideo, filename),
    cover: shots[0].src,
    note: typeof data.note === "string" ? data.note : undefined,
    demoUrl: typeof data.demoUrl === "string" ? data.demoUrl : undefined,
    details: asDetails(data.details, filename),
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
