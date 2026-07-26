import { Reveal } from "@/components/Reveal";

/**
 * Section shell: vertical rhythm (72px mobile / 140px desktop), an optional
 * hairline rule, and the mono section label. The label is the section's `h2` —
 * it looks like a caption but it carries the document outline, so the heading
 * hierarchy stays h1 → h2 → h3 with nothing skipped.
 */
export function Section({
  id,
  label,
  children,
  hairline = true,
  tight = false,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  hairline?: boolean;
  tight?: boolean;
}) {
  return (
    <div className={tight ? "pt-10 md:pt-16" : "pt-[72px] md:pt-[140px]"}>
      {hairline ? (
        <hr
          className={`border-0 border-t border-rule ${tight ? "mb-8 md:mb-10" : "mb-10 md:mb-14"}`}
        />
      ) : null}
      <section id={id} aria-labelledby={`${id}-label`} className="scroll-mt-[72px]">
        <Reveal>
          <h2
            id={`${id}-label`}
            className="mono mb-8 text-[12px] tracking-[0.14em] text-ink-muted uppercase md:mb-10 md:text-[13px]"
          >
            {label}
          </h2>
          {children}
        </Reveal>
      </section>
    </div>
  );
}
