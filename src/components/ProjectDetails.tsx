"use client";

import { useId, useState } from "react";
import { MonoLink } from "@/components/MonoLink";
import type { ProjectDetails as ProjectDetailsData } from "@/lib/projects";

type ProjectDetailsProps = {
  details: ProjectDetailsData;
  title: string;
};

/**
 * Inline "Details ↓" toggle and expanding panel on a project card. No
 * navigation, no route change — this is the alternative to the (currently
 * 404ing) `/work/[slug]` case study page.
 *
 * Height animates via `grid-rows-[0fr]` → `grid-rows-[1fr]` on the wrapper,
 * with the panel's actual content in an `overflow-hidden` inner div. That
 * transitions to the content's real height with no JS measurement, no
 * ResizeObserver, and no hardcoded max-height guess. `motion-safe:` gates
 * both this transition and the arrow rotation, so
 * `prefers-reduced-motion: reduce` gets an instant snap open/close instead.
 *
 * `inert` on the panel keeps the optional repo link out of tab order while
 * collapsed, so closed state has zero hidden focusable elements.
 */
export function ProjectDetails({ details, title }: ProjectDetailsProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Details about ${title}`}
        onClick={() => setOpen((prev) => !prev)}
        className="mono inline-flex h-11 min-w-11 items-center gap-1.5 text-[13px] text-ink"
      >
        <span className="underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:decoration-ink">
          Details
        </span>
        <span
          aria-hidden="true"
          className={`motion-safe:transition-transform motion-safe:duration-200 ${
            open ? "-rotate-180" : ""
          }`}
        >
          ↓
        </span>
      </button>

      <div
        className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 motion-safe:ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            id={panelId}
            inert={!open}
            className="mt-5 flex flex-col gap-5 border-t border-rule pt-5"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
              <DetailList heading="The problem" items={details.problem} />
              <DetailList heading="What I built" items={details.built} />
              <DetailList heading="The hard part" items={details.hardPart} />
            </div>

            {details.stackNotes ? (
              <p className="mono text-[12px] text-ink-muted md:text-[13px]">
                {details.stackNotes}
              </p>
            ) : null}

            {details.repoUrl ? (
              <MonoLink href={details.repoUrl} external>
                View repo →
              </MonoLink>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

type DetailListProps = {
  heading: string;
  items: string[];
};

function DetailList({ heading, items }: DetailListProps) {
  return (
    <div>
      <h4 className="mono text-[12px] tracking-[0.14em] text-ink-muted uppercase md:text-[13px]">
        {heading}
      </h4>
      <ul className="mt-2 flex list-outside list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.6] text-ink-muted marker:text-ink-muted md:text-[16px]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
