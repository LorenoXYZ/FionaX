import type {
  ThresholdLevel,
  ThresholdVerdict
} from "@/app/tools/signer-quorum-simulator/types";

const THRESHOLD_LEVELS: ThresholdLevel[] = ["low", "medium", "high"];

/**
 * Compute the verdict for a single threshold. A null threshold stays null (the
 * record omitted it), and `reached` is false in that case so an unknown
 * threshold never becomes a successful assertion.
 */
export function computeThresholdVerdict(
  level: ThresholdLevel,
  threshold: number | null,
  selectedWeight: number
): ThresholdVerdict {
  if (threshold === null) {
    return { level, threshold: null, selectedWeight, reached: false, shortfall: 0 };
  }

  const shortfall = Math.max(0, threshold - selectedWeight);
  return {
    level,
    threshold,
    selectedWeight,
    reached: selectedWeight >= threshold,
    shortfall
  };
}

/** Compute all three verdicts for a single summed selection. */
export function computeThresholdVerdicts(
  thresholds: Record<ThresholdLevel, number | null>,
  selectedWeight: number
): Record<ThresholdLevel, ThresholdVerdict> {
  const result = {} as Record<ThresholdLevel, ThresholdVerdict>;
  for (const level of THRESHOLD_LEVELS) {
    result[level] = computeThresholdVerdict(level, thresholds[level], selectedWeight);
  }
  return result;
}
