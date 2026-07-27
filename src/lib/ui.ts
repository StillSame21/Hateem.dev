/**
 * Divider class for the Nth row in a hairline-separated list — every row
 * after the first gets a top rule, the first gets none. Used by Background,
 * AvailabilityCard, Elsewhere, the resume page, and SelectedWork so the same
 * divider rule isn't hand-rolled five times with five slightly different
 * first-item exceptions.
 *
 * Deliberately returns only the divider class, not spacing — spacing (gap,
 * padding) varies per caller and stays with the caller.
 */
export function hairlineClass(index: number): string {
  return index === 0 ? "" : "border-t border-rule";
}
