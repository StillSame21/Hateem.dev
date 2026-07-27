"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project, ProjectShot, ProjectVideo } from "@/lib/projects";

type MediaItem =
  | ({ kind: "video" } & ProjectVideo)
  | ({ kind: "image" } & ProjectShot);

/**
 * Up to 4 screenshots per project, plus an optional demo clip, side-scrollable.
 * Replaces the old single-`cover` image in SelectedWork.tsx.
 *
 * The scroller is a plain CSS scroll-snap track, so swipe (touch) and
 * trackpad scroll work with zero JavaScript. The buttons, dots, and
 * IntersectionObserver below are enhancement on top of that, not the only
 * way to move through the gallery. A gallery of one item renders as a plain
 * image with no controls.
 *
 * A demo clip is never fetched on page load. It renders as a poster image
 * behind a play button (see the `kind === "video"` branch below), and the
 * `<video>` element itself is not mounted into the DOM until that button is
 * clicked — see PlaySlide.
 */
export function ProjectShots({ project }: { project: Project }) {
  const { shots, demoVideo, title } = project;
  // A demo clip replaces the gallery outright rather than joining it as
  // slide 0 — a project with a demo shows the demo, full stop, no side-scroll
  // to a screenshot behind it. `shots` stays required in the frontmatter
  // schema (it still feeds `cover`), it's just not rendered here.
  const media: MediaItem[] = demoVideo
    ? [{ kind: "video", ...demoVideo }]
    : shots.map((s) => ({ kind: "image" as const, ...s }));

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || media.length < 2) return;

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
  }, [media.length]);

  if (media.length === 1) {
    const only = media[0];
    return only.kind === "video" ? (
      <PlaySlide item={only} active />
    ) : (
      <Image
        src={only.src}
        alt={only.alt}
        width={1600}
        height={900}
        sizes="(min-width: 768px) 46vw, 100vw"
        className="aspect-video w-full rounded-[3px] border border-rule bg-surface object-cover shadow-[0_1px_3px_rgba(21,25,28,0.05)]"
      />
    );
  }

  /**
   * Scroll the track — and only the track — so slide `index` sits flush with
   * its left content edge.
   *
   * This used to be `slide.scrollIntoView({ inline: "start" })`. That is a
   * trap: scrollIntoView walks the entire ancestor chain and scrolls *every*
   * scroll container on it, the viewport included, which is how clicking a dot
   * used to drag the whole page sideways. `html { overflow-x: clip }` in
   * globals.css now denies it the viewport, but a stylesheet should not be
   * what contains a script — scope the scroll here.
   *
   * The delta comes from two live bounding rects, not `slide.offsetLeft`.
   * `offsetLeft` is measured from the nearest *positioned* ancestor, which is
   * the `.relative` wrapper below rather than the track, so it carries the
   * track's 1px border and would break outright if that wrapper's positioning
   * ever moved. `track.clientLeft` is that border width.
   *
   * `scrollTo` is deliberately called with no `behavior`, so it resolves to
   * the element's computed `scroll-behavior`. That preserves the smooth glide
   * defined in globals.css under `prefers-reduced-motion: no-preference` —
   * passing `behavior: "smooth"` would force the animation on for everyone and
   * silently defeat that gate.
   */
  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;

    setActive(index);

    const delta =
      slide.getBoundingClientRect().left -
      (track.getBoundingClientRect().left + track.clientLeft);

    track.scrollTo({ left: track.scrollLeft + delta });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${title} screenshots`}
        tabIndex={0}
        className="shots-scroller flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[3px] border border-rule focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        {media.map((item, index) => (
          <div
            key={item.src}
            aria-label={`${index + 1} of ${media.length}`}
            className="aspect-video w-full shrink-0 snap-start"
          >
            {item.kind === "video" ? (
              <PlaySlide item={item} active={index === active} />
            ) : (
              <Image
                src={item.src}
                alt={item.alt}
                width={1600}
                height={900}
                loading={index === 0 ? undefined : "lazy"}
                sizes="(min-width: 768px) 46vw, 100vw"
                className="h-full w-full bg-surface object-cover"
              />
            )}
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
        onClick={() => goTo(Math.min(active + 1, media.length - 1))}
        disabled={active === media.length - 1}
        aria-label="Next screenshot"
        className="mono absolute top-1/2 right-2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[3px] border border-rule bg-surface text-ink shadow-[0_1px_3px_rgba(21,25,28,0.08)] transition-opacity hover:bg-paper disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        →
      </button>

      <div className="mt-2 flex items-center justify-center gap-1.5">
        {media.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to screenshot ${index + 1} of ${media.length}`}
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

/**
 * A video slide starts as a poster image behind a play button — no <video>
 * in the DOM, so no video bytes are ever requested by page load. Clicking
 * the button mounts the real element with `preload="none"` + `autoPlay`,
 * so the click that revealed it is also the click that starts it. There is
 * no `muted` prop: the source clip has no audio track (see the README note
 * on `-an` in the encode step), so the browser has nothing to mute.
 *
 * Once mounted, the element pauses itself whenever `active` goes false —
 * i.e. the carousel scrolled to a different slide — so a swipe away from a
 * playing demo doesn't leave it decoding frames offscreen.
 */
function PlaySlide({ item, active }: { item: ProjectVideo; active: boolean }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!active) videoRef.current?.pause();
  }, [active]);

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play demo: ${item.alt}`}
        className="group relative block h-full w-full bg-surface"
      >
        <Image
          src={item.poster}
          alt={item.alt}
          width={1600}
          height={900}
          sizes="(min-width: 768px) 46vw, 100vw"
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/30">
          <span className="mono inline-flex h-14 items-center gap-2 rounded-full bg-ink px-5 text-[13px] text-paper shadow-[0_1px_3px_rgba(21,25,28,0.2)]">
            ▶ Play demo · {item.duration}
          </span>
        </span>
      </button>
    );
  }

  return (
    <video
      ref={videoRef}
      src={item.src}
      poster={item.poster}
      controls
      autoPlay
      playsInline
      preload="none"
      aria-label={item.alt}
      className="h-full w-full bg-surface object-cover"
    />
  );
}
