import { Section } from "@/components/Section";

/**
 * No proficiency bars, no star ratings, no percentages — just what I use.
 *
 * TODO: Hateem — this list was seeded only from things the projects and
 * credentials on this page actually evidence (the FYP stack, CarGO's stack,
 * this site's stack, the SwiftUI academy, the load test, the webinar). Add
 * what's missing and delete anything you would not want to be asked about in
 * an interview.
 */
const GROUPS = [
  {
    label: "Languages",
    items: ["C++", "Java", "JavaScript", "PHP", "SQL"],
  },
  {
    label: "Frameworks",
    items: ["React", "FastAPI", "Tailwind CSS", "RestAPI"],
  },
  {
    label: "Infrastructure",
    items: ["Docker", "MySQL", "Git", "Linux", "Vercel"],
  },
  {
    label: "Practices",
    items: [
      "REST API design",
      "Load testing",
      "Accessibility",
      "Technical writing",
    ],
  },
] as const;

export function Toolkit() {
  return (
    <Section id="toolkit" label="Toolkit">
      <div className="flex flex-col gap-8 md:gap-10">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="mono text-[12px] text-ink-muted md:text-[13px]">
              {group.label}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="mono rounded-[3px] border border-rule bg-surface px-2.5 py-1.5 text-[12px] text-ink md:text-[13px]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
