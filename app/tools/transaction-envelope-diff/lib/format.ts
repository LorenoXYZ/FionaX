/**
 * Presentation-only helpers. Keep formatting out of components and domain
 * logic — components and `lib/transactionEnvelopeDiff.ts` never render a raw
 * canonical value directly, only through this module.
 */

/** Shorten a canonical XDR/hex string for display without changing it. */
export function formatCanonicalValue(value: string): string {
  if (value.length <= 40) {
    return value;
  }
  return `${value.slice(0, 20)}…${value.slice(-12)}`;
}

/** A human label for an envelope kind. */
export function formatEnvelopeKind(kind: string): string {
  switch (kind) {
    case "v0":
      return "legacy (v0)";
    case "v1":
      return "current (v1)";
    case "fee_bump":
      return "fee bump";
    default:
      return kind;
  }
}

/** A human label for a diff change kind. */
export function formatChangeKind(kind: string): string {
  switch (kind) {
    case "added":
      return "added";
    case "removed":
      return "removed";
    case "changed":
      return "changed";
    default:
      return kind;
  }
}
