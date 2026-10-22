import { describe, expect, it } from "vitest";
import { computeNextSequence } from "@/app/tools/sequence-inspector/lib/next-sequence";
import { currentSequence, expectedNextSequence } from "@/tests/tools/sequence-inspector/fixtures/account-sequence.fixture";
import { highCurrentSequence, expectedHighNextSequence } from "@/tests/tools/sequence-inspector/fixtures/high-sequence.fixture";

describe("computeNextSequence", () => {
  it("adds exactly one to a typical sequence number", () => {
    expect(computeNextSequence(currentSequence)).toBe(expectedNextSequence);
  });

  it("adds exactly one to a value beyond Number.MAX_SAFE_INTEGER without precision loss", () => {
    const next = computeNextSequence(highCurrentSequence);
    expect(next).toBe(expectedHighNextSequence);
    // A Number-based `+1` would have landed here instead — proving the bug
    // this function exists to avoid, not just asserting the right answer.
    expect(next).not.toBe(String(Number(highCurrentSequence) + 1));
  });

  it("handles a zero sequence number (a freshly created account)", () => {
    expect(computeNextSequence("0")).toBe("1");
  });

  it("rejects a non-decimal-integer string instead of silently computing garbage", () => {
    expect(() => computeNextSequence("12.5")).toThrow();
    expect(() => computeNextSequence("abc")).toThrow();
  });
});
