"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";

/**
 * Up to 3 screenshots per project, side-scrollable. Replaces the old
 * single-`cover` image in SelectedWork.tsx.
 *
 * The scroller is a plain CSS scroll-snap track, so swipe (touch) and
 * trackpad scroll work with zero JavaScript. The buttons, dots, and
 * IntersectionObserver below are enhancement on top of that, not the only
 * way to move through the gallery. A gallery of one shot renders as a plain
 * image with no controls.
 */
export function ProjectShots({ project }: { project: Project }) {
  const { shots, title } = project;
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || shots.length < 2) return;

    const slides = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(slides.indexOf(visible.target as HTMLElement));
      },
      { root: track, threshold: 0.6 },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [shots.length]);

  if (shots.length === 1) {
    return (
      <Image
        src={shots[0].src}
        alt={shots[0].alt}
        width={1600}
        height={900}
        sizes="(min-width: 768px) 46vw, 100vw"
        className="aspect-video w-full rounded-[3px] border border-rule bg-surface object-cover shadow-[0_1px_3px_rgba(21,25,28,0.05)]"
      />
    );
  }

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ block: "nearest", inline: "start" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${title} screenshots`}
        tabIndex={0}
        className="shots-scroller flex snap-x snap-mandatory overflow-x-auto rounded-[3px] border border-rule focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        {shots.map((shot, index) => (
          <div
            key={shot.src}
            aria-label={`${index + 1} of ${shots.length}`}
            className="aspect-video w-full shrink-0 snap-start"
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              width={1600}
              height={900}
              loading={index === 0 ? undefined : "lazy"}
              sizes="(min-width: 768px) 46vw, 100vw"
              className="h-full w-full bg-surface object-cover"
            />
          </div>
        ))}
      </div>

      {/* Prev/next: from `md` only, where there is no swipe gesture. */}
      <button
        type="button"
        onClick={() => goTo(Math.max(active - 1, 0))}
        disabled={active === 0}
        aria-label="Previous screenshot"
        className="mono absolute top-1/2 left-2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[3px] border border-rule bg-surface text-ink shadow-[0_1px_3px_rgba(21,25,28,0.08)] transition-opacity hover:bg-paper disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => goTo(Math.min(active + 1, shots.length - 1))}
        disabled={active === shots.length - 1}
        aria-label="Next screenshot"
        className="mono absolute top-1/2 right-2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[3px] border border-rule bg-surface text-ink shadow-[0_1px_3px_rgba(21,25,28,0.08)] transition-opacity hover:bg-paper disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        →
      </button>

      <div className="mt-2 flex items-center justify-center gap-1.5">
        {shots.map((shot, index) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to screenshot ${index + 1} of ${shots.length}`}
            aria-current={index === active}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              index === active ? "bg-ink" : "bg-rule"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
