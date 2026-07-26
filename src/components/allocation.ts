/**
 * The allocation timeline — the data behind the hero's signature strip.
 *
 * Edit this file to change the timeline. `AllocationStrip.tsx` derives every
 * position, width and label decision from what is here, so layout code never
 * needs touching.
 *
 * Months are `[year, month]` with month 1-12. A block's `start` is inclusive
 * and its `end` is exclusive, so a block running September to December 2026 is
 * `start: [2026, 9], end: [2027, 1]`.
 */

export type Month = readonly [year: number, month: number];

export type AllocationBlock = {
  id: string;
  /** Descriptive name, shown inside the block where it fits. */
  name: string;
  /** Longer form for the legend, when the block itself has less room. */
  legendName?: string;
  /** Human-readable range, e.g. "2023 — 2026". Shown inside wider blocks. */
  range: string;
  /** Compact range for narrow viewports, e.g. "2023—26". */
  short: string;
  start: Month;
  /** Exclusive. */
  end: Month;
  /**
   * `filled` and `dense` are allocated time, drawn in ink at low opacity.
   * `open` is the unallocated slot — the point of the whole element.
   */
  tone: "filled" | "dense" | "open";
};

export type AllocationLane = {
  id: string;
  /** Not rendered visibly; the legend carries the naming. */
  label: string;
  blocks: AllocationBlock[];
};

/**
 * The time axis. It opens where the degree opens rather than at January 2023,
 * so there is no dead space before the first block, and runs a little past the
 * open slot so the tail reads as unscheduled.
 */
export const AXIS: { start: Month; end: Month } = {
  start: [2023, 10],
  end: [2027, 4],
};

/**
 * Two lanes sharing one axis: what I'm enrolled in on top, what I'm building
 * underneath. The industrial training slot sits on the work lane inside the
 * span of the degree, which is exactly where it falls in reality.
 */
export const LANES: AllocationLane[] = [
  {
    id: "education",
    label: "Education",
    blocks: [
      {
        id: "degree",
        name: "Bachelor of Computer Science, UiTM",
        range: "2023 — 2026",
        short: "2023—26",
        start: [2023, 10],
        end: [2027, 1],
        tone: "filled",
      },
    ],
  },
  {
    id: "work",
    label: "Projects and availability",
    blocks: [
      {
        id: "fyp",
        name: "IW-CloudMASim",
        legendName: "IW-CloudMASim (FYP)",
        range: "2025 — 2026",
        short: "2025—26",
        start: [2025, 10],
        end: [2026, 9],
        tone: "dense",
      },
      {
        id: "open",
        name: "open",
        range: "Sep — Dec 2026",
        short: "open",
        start: [2026, 9],
        end: [2027, 1],
        tone: "open",
      },
    ],
  },
];

export const CAPTION =
  "14-week industrial training · open to Klang Valley and remote";

/** Months elapsed since the start of 2023. */
function monthIndex([year, month]: Month): number {
  return (year - 2023) * 12 + (month - 1);
}

const AXIS_START = monthIndex(AXIS.start);
const AXIS_SPAN = monthIndex(AXIS.end) - AXIS_START;

/**
 * A block's horizontal geometry as fractions of the axis.
 *
 * Values are clamped into the axis, so a mistyped date in the data above can
 * never produce a block that spills past the container — the strip cannot
 * overflow horizontally by construction.
 */
export function blockGeometry(block: AllocationBlock): {
  left: number;
  width: number;
} {
  const rawStart = (monthIndex(block.start) - AXIS_START) / AXIS_SPAN;
  const rawEnd = (monthIndex(block.end) - AXIS_START) / AXIS_SPAN;

  const left = Math.min(Math.max(rawStart, 0), 1);
  const width = Math.min(Math.max(rawEnd, 0), 1) - left;

  return { left, width: Math.max(width, 0) };
}

/**
 * Label thresholds, as a fraction of the axis width.
 *
 * A 4-month slot on a 51-month axis is about 24px wide at 360px, which cannot
 * hold a word. Rather than distort the proportions with a minimum width or
 * clip text into an ellipsis, narrow blocks simply drop their in-block label
 * and rely on the legend, which is visible at every width.
 */
export const LABEL_THRESHOLD = {
  /** Below this, no label fits inside the block on a 360px screen. */
  mobile: 0.12,
  /** At or above this, the block is wide enough for the range and the name. */
  descriptive: 0.2,
};

/** Draw order for the load animation: left to right along the axis. */
export function drawOrder(lanes: AllocationLane[]): Map<string, number> {
  const ordered = lanes
    .flatMap((lane) => lane.blocks)
    .sort((a, b) => monthIndex(a.start) - monthIndex(b.start));

  return new Map(ordered.map((block, index) => [block.id, index]));
}

/** Axis endpoint labels, e.g. "2023" and "2027". */
export const AXIS_LABELS = {
  start: String(AXIS.start[0]),
  end: String(AXIS.end[0]),
};
