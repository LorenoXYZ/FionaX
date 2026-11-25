import { describe, expect, it } from "vitest";
import { validateTransactionEnvelopeDiffInput } from "@/app/tools/transaction-envelope-diff/schema";
import { baseEnvelope } from "@/tests/tools/transaction-envelope-diff/fixtures/normal.fixture";

describe("validateTransactionEnvelopeDiffInput", () => {
  it("rejects empty inputs", () => {
    const result = validateTransactionEnvelopeDiffInput("  ", baseEnvelope);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_input");
  });

  it("rejects non-base64 input", () => {
    const result = validateTransactionEnvelopeDiffInput("!!!", baseEnvelope);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_input");
  });

  it("rejects oversized input", () => {
    const big = "A".repeat(1_000_001);
    const result = validateTransactionEnvelopeDiffInput(big, baseEnvelope);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("too_large");
  });

  it("accepts two valid base64 envelopes", () => {
    const result = validateTransactionEnvelopeDiffInput(baseEnvelope, baseEnvelope);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.input.leftEnvelope).toBe(baseEnvelope);
      expect(result.input.rightEnvelope).toBe(baseEnvelope);
    }
  });
});
