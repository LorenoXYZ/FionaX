import { describe, expect, it } from "vitest";
import {
  computeThresholdVerdict,
  computeThresholdVerdicts
} from "@/app/tools/signer-quorum-simulator/lib/threshold-verdict";

describe("computeThresholdVerdict", () => {
  it("marks a reached threshold with zero shortfall", () => {
    const verdict = computeThresholdVerdict("medium", 2, 3);
    expect(verdict.reached).toBe(true);
    expect(verdict.shortfall).toBe(0);
  });

  it("reports an exact threshold as reached", () => {
    const verdict = computeThresholdVerdict("medium", 2, 2);
    expect(verdict.reached).toBe(true);
    expect(verdict.shortfall).toBe(0);
  });

  it("computes the remaining shortfall below a threshold", () => {
    const verdict = computeThresholdVerdict("high", 3, 1);
    expect(verdict.reached).toBe(false);
    expect(verdict.shortfall).toBe(2);
  });

  it("never treats a null threshold as reached", () => {
    const verdict = computeThresholdVerdict("high", null, 10);
    expect(verdict.threshold).toBeNull();
    expect(verdict.reached).toBe(false);
    expect(verdict.shortfall).toBe(0);
  });
});

describe("computeThresholdVerdicts", () => {
  it("returns all three levels in order", () => {
    const verdicts = computeThresholdVerdicts({ low: 1, medium: 2, high: 3 }, 2);
    expect(Object.keys(verdicts)).toEqual(["low", "medium", "high"]);
    expect(verdicts.low.reached).toBe(true);
    expect(verdicts.medium.reached).toBe(true);
    expect(verdicts.high.reached).toBe(false);
    expect(verdicts.high.shortfall).toBe(1);
  });
});
