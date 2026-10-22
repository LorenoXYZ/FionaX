import { formatBigIntDecimal } from "@/app/tools/sequence-inspector/lib/bigint-format";

/**
 * Presentation-only helpers. Keep formatting out of components and domain
 * logic — components and `lib/sequenceInspector.ts` never call
 * `formatBigIntDecimal` directly, only this module.
 */
export function formatSequenceNumber(value: string): string {
  return formatBigIntDecimal(value);
}
