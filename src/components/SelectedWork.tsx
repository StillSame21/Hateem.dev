import { ProjectDetails } from "@/components/ProjectDetails";
import { ProjectShots } from "@/components/ProjectShots";
import { Section } from "@/components/Section";
import { getProjects, type Project } from "@/lib/projects";

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
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <ProjectEntry
            key={project.slug}
            project={project}
            withRule={index > 0}
            mirrored={index % 2 === 1}
          />
        ))}
      </div>
    </Section>
  );
}

function ProjectEntry({
  project,
  withRule,
  mirrored,
}: {
  project: Project;
  withRule: boolean;
  mirrored: boolean;
}) {
  return (
    <article className={withRule ? "border-t border-rule pt-12 md:pt-16" : ""}>
      <div
        className={`flex flex-col gap-6 md:flex-row md:items-start md:gap-12 ${
          mirrored ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Cover is always on top on mobile, and the aspect ratio is locked so
            nothing shifts as the image loads. */}
        <div className="w-full md:w-[54%] md:shrink-0">
          {/* No `priority` here: shots sit well below the fold, and
              preloading them competes with the hero for bandwidth and pushes
              LCP out — see ProjectShots.tsx. */}
          <ProjectShots project={project} />
        </div>

        <div className="md:flex-1">
          <h3
            className={`text-ink ${
              project.featured
                ? "text-[26px] leading-[1.2] md:text-[38px]"
                : "text-[22px] leading-[1.25] md:text-[30px]"
            }`}
          >
            {project.title}
          </h3>

          <p className="mt-3 max-w-[52ch] text-[16px] leading-[1.6] text-ink-muted md:text-[17px]">
            {project.tagline}
          </p>

          <p className="mono mt-5 text-[12px] text-ink-muted md:text-[13px]">
            {project.stack.join(" · ")}
          </p>

          {/* Deliberately no accent on the metrics. The brief rations --signal
              to links, the primary button, the availability card's status dot
              and the availability pill — "nothing else" — so these stay plain
              ink. */}
          {project.metrics.length > 0 ? (
            <ul className="mono mt-5 flex flex-col gap-2 text-[12px] text-ink md:text-[13px]">
              {project.metrics.slice(0, 3).map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
          ) : null}

          <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* Primary: the one link that actually works today. bg-ink, not
                bg-signal — the accent is rationed to five uses elsewhere on
                the page (see README, "The accent is rationed"), so a button
                look here comes from ink instead of spending a sixth. */}
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono inline-flex h-11 items-center justify-center bg-ink px-5 text-[13px] text-paper transition-opacity hover:opacity-90"
              >
                View live demo →
              </a>
            ) : null}
          </p>

          {project.details ? (
            <ProjectDetails details={project.details} title={project.title} />
          ) : null}

          {project.note ? (
            <p className="mono mt-1 max-w-[48ch] text-[12px] leading-[1.5] text-ink-muted">
              {project.note}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
