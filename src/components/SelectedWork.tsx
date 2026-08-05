import { ProjectDetails } from "@/components/ProjectDetails";
import { ProjectShots } from "@/components/ProjectShots";
import { Section } from "@/components/Section";
import { getProjects, type Project } from "@/lib/projects";
import { hairlineClass } from "@/lib/ui";

/**
 * Two entries, separated by a hairline. No cards, no boxes.
 *
 * Copy comes from the MDX frontmatter in src/content/projects, so this section
 * and the case study pages will always agree.
 */
export function SelectedWork() {
  const projects = getProjects();

  return (
    <Section id="work" label="Selected work" tight>
      <div className="flex flex-col gap-12 md:gap-16">
        {projects.map((project, index) => (
          <ProjectEntry key={project.slug} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}

export type ProjectCardProps = {
  project: Project;
  /** Position in the list — index 0 skips the top hairline. */
  index: number;
};

/**
 * Stacked top-to-bottom: header (title, tagline, stack), then the media
 * showcase at full card width, then metrics/CTA/details/note. No side-by-side
 * columns at any viewport, so there is no shorter column to leave a gap
 * beneath — see the layout note in ProjectShots.tsx.
 */
function ProjectEntry({ project, index }: ProjectCardProps) {
  return (
    <article
      className={`${hairlineClass(index)} ${index > 0 ? "pt-12 md:pt-16" : ""}`}
    >
      <div className="flex w-full max-w-full flex-col gap-5 md:gap-6">
        <header>
          <h3
            className={`text-ink ${
              project.featured
                ? "text-[26px] leading-[1.2] md:text-[38px]"
                : "text-[22px] leading-[1.25] md:text-[30px]"
            }`}
          >
            {project.title}
          </h3>

          <p className="mt-3 max-w-[var(--measure-prose)] text-[16px] leading-[1.6] text-ink-muted md:text-[17px]">
            {project.tagline}
          </p>

          <p className="mono mt-4 text-[12px] text-ink-muted md:text-[13px]">
            {project.stack.join(" · ")}
          </p>
        </header>

        {/* No `priority` here: shots sit well below the fold, and preloading
            them competes with the hero for bandwidth and pushes LCP out —
            see ProjectShots.tsx. */}
        <ProjectShots
          shots={project.shots}
          demoVideo={project.demoVideo}
          title={project.title}
        />

        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Deliberately no accent on the metrics. The brief rations --signal
              to links, the primary button, the availability card's status dot
              and the availability pill — "nothing else" — so these stay plain
              ink. */}
          {project.metrics.length > 0 ? (
            <ul className="mono flex flex-col gap-2 text-[12px] text-ink md:text-[13px]">
              {project.metrics.slice(0, 3).map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
          ) : null}

          {project.demoUrl ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {/* Primary: the one link that actually works today. bg-ink, not
                  bg-signal — the accent is rationed to five uses elsewhere on
                  the page (see README, "The accent is rationed"), so a button
                  look here comes from ink instead of spending a sixth. */}
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono inline-flex h-11 items-center justify-center bg-ink px-5 text-[13px] text-paper transition-opacity hover:opacity-90"
              >
                View live demo →
              </a>
            </div>
          ) : null}

          {project.details ? (
            <ProjectDetails details={project.details} title={project.title} />
          ) : null}

          {project.note ? (
            <p className="mono max-w-[var(--measure-caption)] text-[12px] leading-[1.5] text-ink-muted">
              {project.note}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
