import { Section } from "@/components/Section";

const FACTS = [
  ["Institution", "Universiti Teknologi MARA, Shah Alam"],
  ["Programme", "BSc (Hons) Computer Science"],
  ["CGPA", "3.88"],
  ["Recognition", "Dean's Award"],
  ["Based in", "Selangor, Malaysia"],
  ["Available", "September – December 2026"],
] as const;

export function Background() {
  return (
    <Section id="background" label="Background">
      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        <div className="md:flex-1">
          {/*
            TODO: Hateem — replace the two paragraphs below with your own.
            Three or four sentences. Worth covering: how you got into building
            systems, what kind of problem you like being handed, and what you
            want out of the industrial training placement specifically. Written
            in the first person, no mono type in prose.
          */}
          <p className="max-w-[62ch] text-[16px] leading-[1.6] text-ink-muted md:text-[17px]">
            Placeholder. I am a final-year computer science student at UiTM Shah
            Alam, and most of what I know I learned by building the thing and
            then finding out where it broke under load.
          </p>
          <p className="mt-5 max-w-[62ch] text-[16px] leading-[1.6] text-ink-muted md:text-[17px]">
            Placeholder. Write two or three more sentences here about the work
            you want to be doing and what you are looking for in a placement.
          </p>
        </div>

        {/* Key-value pairs are structural data, so they are mono. Hairline
            dividers between rows, no box around the list. */}
        <dl className="mono w-full text-[12px] md:w-[42%] md:shrink-0 md:text-[13px]">
          {FACTS.map(([key, value], index) => (
            <div
              key={key}
              className={`flex flex-col gap-1 py-3 sm:flex-row sm:gap-4 ${
                index === 0 ? "" : "border-t border-rule"
              }`}
            >
              <dt className="text-ink-muted sm:w-[38%] sm:shrink-0">{key}</dt>
              <dd className="text-ink sm:flex-1">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
