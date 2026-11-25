import type {
  SignerQuorumSimulatorInput,
  SignerQuorumSimulatorResult
} from "@/app/tools/signer-quorum-simulator/types";
import {
  parseSignerSnapshot,
  SignerSnapshotError
} from "@/app/tools/signer-quorum-simulator/lib/signer-snapshot";
import { computeSelectedWeight } from "@/app/tools/signer-quorum-simulator/lib/selected-weight";
import { computeThresholdVerdicts } from "@/app/tools/signer-quorum-simulator/lib/threshold-verdict";

/**
 * Compose the domain modules into the final result. Fully offline: it reads the
 * pasted JSON, deduplicates the selection, sums weights and evaluates every
 * threshold. Any parse failure surfaces as a typed error for the hook to map.
 */
export function runSignerQuorumSimulator(
  input: SignerQuorumSimulatorInput
): SignerQuorumSimulatorResult {
  const snapshot = parseSignerSnapshot(input.rawAccountJson);

  const selected = computeSelectedWeight(snapshot, input.selectedKeys);

  const verdicts = computeThresholdVerdicts(snapshot.thresholds, selected.totalWeight);

  // A verdict is "incomplete" when any threshold was omitted or any selected
  // signer's weight was unknown — missing evidence must not look like success.
  const thresholdsMissing = Object.values(snapshot.thresholds).some((t) => t === null);
  const evidenceIncomplete = thresholdsMissing || selected.hasUnknownWeight;

  return {
    accountId: snapshot.accountId,
    contributions: selected.contributions,
    verdicts,
    unresolved: selected.unresolved,
    evidenceIncomplete
  };
}

export { SignerSnapshotError };
