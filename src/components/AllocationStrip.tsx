import {
  AXIS_LABELS,
  CAPTION,
  LABEL_THRESHOLD,
  LANES,
  blockGeometry,
  drawOrder,
  type AllocationBlock,
} from "@/components/allocation";

/**
 * The allocation strip.
 *
 * My education, my projects and my availability as allocated blocks on one
 * shared time axis, with September–December 2026 left as an unallocated slot.
 * Two lanes: what I'm enrolled in above, what I'm building below.
 *
 * Notes on the implementation:
 *
 *  - Blocks are absolutely positioned at percentage offsets inside a
 *    max-width container, so the strip cannot overflow horizontally at any
 *    viewport width. There are no minimum widths fighting the layout.
 *  - The band itself is `aria-hidden`. It is a visualisation; the legend below
 *    it is its accessible equivalent and is visible to everyone at every
 *    width, so no information lives only in the graphic.
 *  - The draw-in animation is pure CSS (see globals.css), which keeps this a
 *    server component and lets it fire on first paint with no JS.
 */
export function AllocationStrip() {
  const order = drawOrder(LANES);

  return (
    <figure className="mt-10 md:mt-12">
      {/* Axis endpoints only. Enough to read the band as time, quiet enough to
          stay out of the way — and two labels cannot collide at 360px. */}
      <div
        className="mono mb-2 flex items-baseline justify-between text-[12px] text-ink-muted"
        aria-hidden="true"
      >
        <span>{AXIS_LABELS.start}</span>
        <span>{AXIS_LABELS.end}</span>
      </div>

      <div
        className="flex h-12 flex-col gap-[2px] overflow-hidden rounded-[3px] border border-rule bg-surface p-1 md:h-16 md:gap-1 md:p-1.5"
        aria-hidden="true"
      >
        {LANES.map((lane) => (
          <div key={lane.id} className="relative flex-1">
            {lane.blocks.map((block) => (
              <Block
                key={block.id}
                block={block}
                drawIndex={order.get(block.id) ?? 0}
              />
            ))}
          </div>
        ))}
      </div>

      {/*
        The legend carries the full names at narrow widths, where the blocks
        only have room for years. From `md` the blocks label themselves, so the
        legend collapses to screen-reader-only rather than disappearing — the
        band above is aria-hidden, so this stays the accessible reading of the
        strip at every width.
      */}
      <ul className="mono mt-3 flex flex-col gap-1.5 text-[12px] md:sr-only">
        {LANES.flatMap((lane) => lane.blocks).map((block) => (
          <li key={block.id} className="flex items-center gap-2">
            <span
              className={`h-2 w-2 shrink-0 rounded-[1px] ${
                block.tone === "open"
                  ? "border border-dashed border-signal bg-signal-tint"
                  : block.tone === "dense"
                    ? "bg-ink/25"
                    : "bg-ink/12"
              }`}
              aria-hidden="true"
            />
            <span
              className={
                block.tone === "open" ? "text-signal" : "text-ink-muted"
              }
            >
              {block.range} · {block.legendName ?? block.name}
            </span>
          </li>
        ))}
      </ul>

      <figcaption className="mono mt-3 text-[12px] text-ink-muted md:mt-4 md:text-[13px]">
        {CAPTION}
      </figcaption>
    </figure>
  );
}

function Block({
  block,
  drawIndex,
}: {
  block: AllocationBlock;
  drawIndex: number;
}) {
  const { left, width } = blockGeometry(block);
  const isOpen = block.tone === "open";

  // Label decisions come from the block's own width, so editing the timeline
  // in allocation.ts adapts the labelling automatically.
  const fitsMobileLabel = width >= LABEL_THRESHOLD.mobile;
  const fitsDescriptive = width >= LABEL_THRESHOLD.descriptive;

  const tone = isOpen
    ? "border border-dashed border-signal bg-signal-tint text-signal"
    : block.tone === "dense"
      ? "bg-ink/16 text-ink"
      : "bg-ink/8 text-ink";

  return (
    <div
      className={`alloc-block absolute inset-y-0 flex items-center overflow-hidden rounded-[2px] px-1.5 md:px-2 ${tone} ${
        isOpen ? "alloc-block--open" : ""
      }`}
      style={
        {
          left: `${left * 100}%`,
          width: `${width * 100}%`,
          "--alloc-i": drawIndex,
        } as React.CSSProperties
      }
    >
      {/* The open slot's label is weight 500. --signal on --signal-tint is the
          thinnest pairing in the palette (4.49:1), and the band is aria-hidden
          with the legend below carrying the accessible reading at 4.86:1. */}
      <span
        className={`mono text-[12px] leading-none whitespace-nowrap md:text-[13px] ${
          isOpen ? "font-medium" : ""
        } ${fitsMobileLabel ? "" : "hidden md:inline"}`}
      >
        {/* Narrow viewports get the compact range; the open slot always reads
            as the word itself, because that is the message of the page. */}
        <span className="md:hidden">{block.short}</span>
        <span className="hidden md:inline">
          {isOpen
            ? block.name
            : fitsDescriptive
              ? `${block.range} · ${block.name}`
              : block.range}
        </span>
      </span>
    </div>
  );
}
