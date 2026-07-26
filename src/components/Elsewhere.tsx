import { Section } from "@/components/Section";

const ITEMS = [
  {
    date: "2026",
    title:
      'Speaker, SULAM International Webinar: "Ethical Challenges of AI in Academic Learning and Assessment"',
    detail: "500+ attendees",
  },
  {
    date: "2025",
    title: "Korea-ASEAN Digital Academy",
    detail: "NIPA / MDEC",
  },
  {
    date: "",
    title: "PETRONAS Scholar",
    detail: "",
  },
  {
    date: "2023",
    title: "SwiftUI Academy",
    detail: "STDC × Apple Consultants Network",
  },
] as const;

export function Elsewhere() {
  return (
    <Section id="elsewhere" label="Elsewhere">
      <ul className="flex flex-col">
        {ITEMS.map((item, index) => (
          <li
            key={item.title}
            className={`flex flex-col gap-1 py-5 sm:flex-row sm:gap-8 ${
              index === 0 ? "pt-0" : "border-t border-rule"
            }`}
          >
            {/* The date column sits above the item on mobile. An empty date
                still reserves its column on desktop so the titles stay aligned. */}
            <span
              className="mono text-[12px] text-ink-muted sm:w-[88px] sm:shrink-0 md:text-[13px]"
              aria-hidden={item.date === "" ? "true" : undefined}
            >
              {item.date || "—"}
            </span>
            <span className="sm:flex-1">
              <span className="block max-w-[62ch] text-[16px] leading-[1.6] text-ink md:text-[17px]">
                {item.title}
              </span>
              {item.detail ? (
                <span className="mono mt-1 block text-[12px] text-ink-muted md:text-[13px]">
                  {item.detail}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
