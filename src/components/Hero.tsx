import { AvailabilityCard } from "@/components/AvailabilityCard";
import { Container } from "@/components/Container";
import { CopyEmail } from "@/components/CopyEmail";
import { MonoLink } from "@/components/MonoLink";
import { PLACEMENT, SITE } from "@/lib/site";

/**
 * The most important part of the page. No scroll-reveal here — this is the
 * first paint, and there is no motion.
 */
export function Hero() {
  return (
    <Container className="flex min-h-[calc(100svh-3.5rem)] flex-col pt-8 pb-4 md:pt-10">
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
          {PLACEMENT.status} · {PLACEMENT.window}
        </span>
      </p>

      {/*
        Full legal name, not the short SITE.name. The name renders at a fixed
        17.66x the font-size in Archivo at wdth 125 / weight 600 with the
        -0.035em tracking from .name-expanded, so a fixed size can only ever be
        right at one viewport width: 60px needed 1060px of line and the widest
        the container ever gets is 984px, which is why it overflowed at every
        width and let the gallery drag the page sideways.

        The md size is therefore fluid rather than fixed: 5.38vw - 5.16px is
        0.95 x (100vw - 96px) / 17.66 — 95% of the container's content width,
        leaving >=33px of slack from 768px up, capped at 52px once the 1080px
        container stops growing.

        `whitespace-nowrap` is deliberately gone rather than kept alongside the
        clamp. next/font loads Archivo with display: "swap" (layout.tsx), so
        first paint uses a fallback face whose metrics we do not control; with
        nowrap that paint overflows by an unbounded amount at any size we pick.
        Without it a metric surprise wraps harmlessly instead, and the clamp is
        what keeps it on one line for the real font. text-balance splits the
        sub-376px wrap into two even lines instead of a short orphan.
      */}
      <h1 className="name-expanded mt-5 text-[20px] leading-[1.15] text-balance text-ink md:mt-6 md:text-[clamp(34px,5.38vw_-_5.16px,52px)]">
        {SITE.fullName}
      </h1>

      <p className="mt-5 max-w-[56ch] text-[16px] leading-[1.6] text-ink-muted md:mt-6 md:text-[17px]">
        Final-year computer science student at UiTM Shah Alam. I build
        full-stack systems — real-time dashboards, distributed simulation, and
        the plumbing in between.
      </p>

      <AvailabilityCard />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <a
          href="#work"
          className="mono inline-flex h-12 w-full items-center justify-center bg-signal px-6 text-[13px] text-white transition-opacity hover:opacity-90 sm:w-auto"
        >
          See the work
        </a>
        <a
          href={SITE.resume}
          className="mono inline-flex h-12 w-full items-center justify-center border border-ink px-6 text-[13px] text-ink transition-colors hover:bg-ink hover:text-paper sm:w-auto"
        >
          Résumé
        </a>
      </div>

      <ul className="mt-5 flex flex-wrap items-center gap-x-6 md:mt-6">
        <li>
          <MonoLink href={SITE.github} external>
            GitHub
          </MonoLink>
        </li>
        <li>
          <MonoLink href={SITE.linkedin} external>
            LinkedIn
          </MonoLink>
        </li>
        <li>
          <CopyEmail
            label="Email"
            className="mono inline-flex h-11 min-w-11 items-center text-[13px] text-ink"
            innerClassName="underline decoration-rule decoration-1 underline-offset-4 transition-colors group-hover:decoration-ink hover:decoration-ink"
          />
        </li>
      </ul>
    </Container>
  );
}
