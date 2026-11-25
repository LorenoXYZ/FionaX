import type {
  AccountSigner,
  SignerSnapshot,
  UnresolvedSigner
} from "@/app/tools/signer-quorum-simulator/types";

/** One resolved contribution, deduplicated across the selection. */
export interface WeightContribution {
  key: string;
  weight: number;
  isMasterKey: boolean;
  type: AccountSigner["type"];
  /** True when this key appeared more than once in the selection. */
  duplicate: boolean;
}

export interface SelectedWeightResult {
  /** The exact deduplicated sum of the selected signer weights. */
  totalWeight: number;
  contributions: WeightContribution[];
  unresolved: UnresolvedSigner[];
  /** True when any selected signer's weight was missing from the record. */
  hasUnknownWeight: boolean;
}

/**
 * Sum each selected signer exactly once. Duplicate selections collapse into a
 * single contribution with `duplicate` set, and selected keys that do not match
 * any account signer are reported separately as unresolved — never silently
 * treated as a zero-weight contribution.
 */
export function computeSelectedWeight(
  snapshot: SignerSnapshot,
  selectedKeys: string[]
): SelectedWeightResult {
  const byKey = new Map<string, AccountSigner>();
  for (const signer of snapshot.signers) {
    byKey.set(signer.key, signer);
  }

  const seen = new Set<string>();
  const contributions: WeightContribution[] = [];
  const unresolved: UnresolvedSigner[] = [];
  let totalWeight = 0;
  let hasUnknownWeight = false;

  for (const key of selectedKeys) {
    const signer = byKey.get(key);
    if (signer === undefined) {
      unresolved.push({ key });
      continue;
    }

    if (seen.has(key)) {
      // Mark the existing contribution as a duplicate rather than adding again.
      const existing = contributions.find((c) => c.key === key);
      if (existing) {
        existing.duplicate = true;
      }
      continue;
    }

    seen.add(key);

    if (signer.weight === null) {
      hasUnknownWeight = true;
      contributions.push({
        key,
        weight: 0,
        isMasterKey: signer.isMasterKey,
        type: signer.type,
        duplicate: false
      });
      continue;
    }

    totalWeight += signer.weight;
    contributions.push({
      key,
      weight: signer.weight,
      isMasterKey: signer.isMasterKey,
      type: signer.type,
      duplicate: false
    });
  }

  return { totalWeight, contributions, unresolved, hasUnknownWeight };
}
