import { PLACEMENT } from "@/lib/site";

const ROWS: [string, React.ReactNode][] = [
  ["Roles", PLACEMENT.focus],
  ["Duration", `${PLACEMENT.length} (${PLACEMENT.window})`],
  [
    "Location",
    <>
      {PLACEMENT.location} <em className="italic">{PLACEMENT.locationNote}</em>
    </>,
  ],
];

/**
 * Replaces the old allocation timeline. States the placement facts directly
 * instead of asking the viewer to decode a two-lane Gantt strip — see the
 * plan this was built from for the full list of problems with that approach.
 *
 * Same idiom as the Background facts list (Background.tsx): hairline-divided
 * `dl` rows, label left, value right, no box. Static markup, no animation,
 * no client JS — this is already its own accessible reading, so there is no
 * separate legend to keep in sync.
 */
export function AvailabilityCard() {
  return (
    <dl className="mono mt-7 max-w-[640px] text-[12px] md:mt-8 md:text-[13px]">
      {ROWS.map(([key, value], index) => (
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
  );
}
