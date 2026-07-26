import type { Metadata } from "next";
import { MonoLink } from "@/components/MonoLink";
import {
  ACTIVITIES,
  EDUCATION,
  LANGUAGES,
  REFERENCES_NOTE,
  RESUME_PROJECTS,
  SKILLS,
  SUMMARY_TEMPLATE,
  TITLE_LINE,
} from "@/content/resume";
import { getProjects } from "@/lib/projects";
import { PLACEMENT, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Résumé",
  alternates: { canonical: "/resume" },
};

/**
 * The canonical résumé, as an HTML page rather than a PDF the browser has to
 * render inline. Same tokens and idioms as the rest of the site — mono
 * section labels (Section.tsx), hairline-divided rows (Background.tsx,
 * AvailabilityCard.tsx) — but `Section` itself is not reused here because it
 * wraps children in `Reveal`, and a résumé should not animate in.
 *
 * `@media print` in globals.css hides `.no-print` and tightens spacing, so
 * Ctrl-P on this page is the replacement for the old Word-exported PDF: one
 * page, embedded web fonts, no orphan REFERENCES page.
 */
export default function ResumePage() {
  const projects = getProjects();

  return (
    <main id="main" className="mx-auto w-full max-w-[720px] px-6 py-10 md:px-0 md:py-16">
      <div className="no-print mb-8">
        <MonoLink href="/">← hateem.dev</MonoLink>
      </div>

      <header className="resume-entry">
        <h1 className="name-expanded text-[32px] leading-[1.1] text-ink md:text-[40px]">
          {SITE.fullName}
        </h1>
        <p className="mono mt-2 text-[13px] text-ink-muted">{TITLE_LINE}</p>

        <p className="mono mt-4 inline-flex items-center gap-2 rounded-full bg-signal-tint px-2.5 py-1.5 text-[12px] text-ink">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
            aria-hidden="true"
          />
          {PLACEMENT.status} · {PLACEMENT.window}
        </p>

        {/* On-screen call-to-action row. Hidden on print — the plain contact
            line below carries the same information as literal text, which is
            what a paper copy needs (a button label like "Email" prints as
            just the word "Email" with no address). */}
        <div className="no-print mt-5 flex flex-wrap gap-3">
          <a
            href={SITE.resumePdf}
            download
            className="mono inline-flex h-11 items-center gap-2 bg-signal px-4 text-[13px] text-white transition-opacity hover:opacity-90"
          >
            <DownloadIcon />
            Download Resume
          </a>
        </div>

        <ul className="mono mt-5 flex flex-wrap items-center gap-x-2">
          <li>
            <MonoLink href={`mailto:${SITE.email}`}>{SITE.email}</MonoLink>
          </li>
          <li aria-hidden="true" className="text-ink-muted">
            ·
          </li>
          <li>
            <MonoLink href={SITE.linkedin} external>
              LinkedIn
            </MonoLink>
          </li>
          <li aria-hidden="true" className="text-ink-muted">
            ·
          </li>
          <li>
            <MonoLink href={SITE.github} external>
              GitHub
            </MonoLink>
          </li>
          <li aria-hidden="true" className="text-ink-muted">
            ·
          </li>
          <li className="text-[13px] text-ink-muted">Selangor, Malaysia</li>
        </ul>
      </header>

      <ResumeSection label="Summary">
        <p className="resume-entry max-w-none text-[15px] leading-[1.6] text-ink-muted">
          {SUMMARY_TEMPLATE(PLACEMENT.window, PLACEMENT.length)}
        </p>
      </ResumeSection>

      <ResumeSection label="Education">
        <dl className="mono text-[12px] md:text-[13px]">
          {EDUCATION.map((entry, index) => (
            <div
              key={entry.institution}
              className={`resume-entry flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 ${
                index === 0 ? "" : "border-t border-rule"
              }`}
            >
              <div>
                <dt className="text-ink">{entry.institution}</dt>
                <dd className="mt-0.5 text-ink-muted">{entry.detail}</dd>
              </div>
              <dd className="shrink-0 text-ink-muted">{entry.range}</dd>
            </div>
          ))}
        </dl>
      </ResumeSection>

      <ResumeSection label="Academic projects">
        <div className="flex flex-col gap-6">
          {projects.map((project) => {
            const resumeProject = RESUME_PROJECTS[project.slug];
            if (!resumeProject) return null;
            return (
              <div key={project.slug} className="resume-entry">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[15px] font-medium text-ink">
                    {project.title}
                  </h3>
                  <span className="mono shrink-0 text-[12px] text-ink-muted">
                    {resumeProject.kind} · {resumeProject.year}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="mono border border-rule px-2 py-0.5 text-[11px] text-ink-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <ul className="mt-3 flex flex-col gap-1 text-[14px] leading-[1.6] text-ink-muted">
                  {resumeProject.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span aria-hidden="true">·</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </ResumeSection>

      <ResumeSection label="Skills">
        <dl className="mono resume-entry flex flex-col gap-2 text-[12px] md:text-[13px]">
          <SkillRow label="Software development" items={SKILLS.softwareDevelopment} />
          <SkillRow label="Database" items={SKILLS.database} />
          <SkillRow label="Tools" items={SKILLS.tools} />
          <SkillRow label="Basic exposure" items={SKILLS.basicExposure} />
          <SkillRow label="Soft skills" items={SKILLS.soft} />
        </dl>
      </ResumeSection>

      <ResumeSection label="Languages">
        <dl className="mono resume-entry flex flex-col gap-2 text-[12px] md:text-[13px]">
          {LANGUAGES.map((lang) => (
            <div key={lang.name} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <dt className="text-ink-muted sm:w-[38%] sm:shrink-0">{lang.name}</dt>
              <dd className="text-ink sm:flex-1">{lang.level}</dd>
            </div>
          ))}
        </dl>
      </ResumeSection>

      <ResumeSection label="Training & activities">
        <div className="flex flex-col gap-5">
          {ACTIVITIES.map((activity) => (
            <div key={activity.title} className="resume-entry">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[15px] font-medium text-ink">
                  {activity.title}
                </h3>
                <span className="mono shrink-0 text-[12px] text-ink-muted">
                  {activity.range}
                </span>
              </div>
              {activity.detail ? (
                <p className="mt-1 text-[14px] leading-[1.6] text-ink-muted">
                  {activity.detail}
                </p>
              ) : null}
              {activity.bullets ? (
                <ul className="mt-2 flex flex-col gap-1 text-[14px] leading-[1.6] text-ink-muted">
                  {activity.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span aria-hidden="true">·</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection label="References" last>
        <p className="resume-entry text-[14px] leading-[1.6] text-ink-muted">
          {REFERENCES_NOTE}
        </p>
      </ResumeSection>
    </main>
  );
}

function ResumeSection({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section className={last ? "mt-9" : "mt-9 pb-9"}>
      <h2 className="mono mb-4 text-[12px] tracking-[0.14em] text-ink-muted uppercase md:text-[13px]">
        {label}
      </h2>
      {children}
      {last ? null : <hr className="mt-9 border-0 border-t border-rule" />}
    </section>
  );
}

function SkillRow({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <dt className="text-ink-muted sm:w-[38%] sm:shrink-0">{label}</dt>
      <dd className="text-ink sm:flex-1">{items.join(" · ")}</dd>
    </div>
  );
}

/* Inline icon for the header's Download Resume button — 14px, currentColor,
   so it picks up the button's own text colour on hover without a second CSS
   rule. */

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}
