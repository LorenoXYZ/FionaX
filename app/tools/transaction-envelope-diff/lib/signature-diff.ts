import type { CanonicalEnvelope } from "@/app/tools/transaction-envelope-diff/lib/envelope-normalize";
import type { SignatureDiff } from "@/app/tools/transaction-envelope-diff/types";

/**
 * Compare signature sets independently of the payload. Signatures are matched
 * by value, not position, so re-ordering or re-signing is reported accurately
 * without ever being mistaken for a payload change.
 */
export function diffSignatures(left: CanonicalEnvelope, right: CanonicalEnvelope): SignatureDiff[] {
  const leftSet = new Set(left.signatures);
  const rightSet = new Set(right.signatures);

  const diffs: SignatureDiff[] = [];

  for (const value of rightSet) {
    if (!leftSet.has(value)) {
      diffs.push({ kind: "added", value });
    }
  }
  for (const value of leftSet) {
    if (!rightSet.has(value)) {
      diffs.push({ kind: "removed", value });
    }
  }

  return diffs;
}

/** True when only the signature sets differ and the payload matches. */
export function isSignatureOnlyChange(
  fieldDiffsCount: number,
  operationDiffsCount: number,
  signatureDiffs: SignatureDiff[]
): boolean {
  return fieldDiffsCount === 0 && operationDiffsCount === 0 && signatureDiffs.length > 0;
}
