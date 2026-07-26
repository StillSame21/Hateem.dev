import { AllocationStrip } from "@/components/AllocationStrip";
import { Container } from "@/components/Container";
import { MonoLink } from "@/components/MonoLink";
import { SITE } from "@/lib/site";

/**
 * The most important part of the page. No scroll-reveal here — this is the
 * first paint, and the only motion is the allocation strip drawing itself in.
 */
export function Hero() {
  return (
    <Container className="pt-14 pb-4 md:pt-24">
      {/*
        Padding and tracking are tuned so the full sentence stays on one line at
        360px — a fully rounded pill wrapping to two lines looks broken.

        The label is --ink, not --signal: --signal on --signal-tint measures
        4.49:1, which misses WCAG AA for normal text by a hundredth. The dot and
        the tint wash still carry the accent, and the brief does not specify a
        text colour here, so this costs nothing.
      */}
      <p className="inline-flex items-center gap-2 rounded-full bg-signal-tint px-2.5 py-1.5 md:px-3">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
          aria-hidden="true"
        />
        <span className="mono text-[12px] tracking-[-0.01em] whitespace-nowrap text-ink">
          Available for internship · Sep–Dec 2026
        </span>
      </p>

      <h1 className="name-expanded mt-6 text-[40px] leading-[1.1] text-ink md:mt-8 md:text-[84px]">
        {SITE.name}
      </h1>

      <p className="mt-6 max-w-[56ch] text-[16px] leading-[1.6] text-ink-muted md:mt-7 md:text-[17px]">
        Final-year computer science student at UiTM Shah Alam. I build
        full-stack systems — real-time dashboards, distributed simulation, and
        the plumbing in between.
      </p>

      <AllocationStrip />

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-12">
        <a
          href="#work"
          className="mono inline-flex h-12 w-full items-center justify-center bg-signal px-6 text-[13px] text-white transition-opacity hover:opacity-90 sm:w-auto"
        >
          See the work
        </a>
        <a
          href={SITE.resume}
          download
          className="mono inline-flex h-12 w-full items-center justify-center border border-ink px-6 text-[13px] text-ink transition-colors hover:bg-ink hover:text-paper sm:w-auto"
        >
          Download résumé
        </a>
      </div>

      <ul className="mt-6 flex flex-wrap items-center gap-x-6 md:mt-8">
        <li>
          <MonoLink href={SITE.github} external>
            GitHub
          </MonoLink>
        </li>
        <li>
          {/* TODO: point SITE.linkedin at the real profile URL. */}
          <MonoLink href={SITE.linkedin} external>
            LinkedIn
          </MonoLink>
        </li>
        <li>
          <MonoLink href={`mailto:${SITE.email}`}>Email</MonoLink>
        </li>
      </ul>
    </Container>
  );
}
