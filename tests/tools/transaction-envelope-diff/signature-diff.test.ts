import { describe, expect, it } from "vitest";
import { diffSignatures, isSignatureOnlyChange } from "@/app/tools/transaction-envelope-diff/lib/signature-diff";
import { normalizeEnvelope } from "@/app/tools/transaction-envelope-diff/lib/envelope-normalize";
import { baseEnvelope } from "@/tests/tools/transaction-envelope-diff/fixtures/normal.fixture";

describe("diffSignatures", () => {
  it("returns no diffs for empty signature sets", () => {
    const left = normalizeEnvelope(baseEnvelope);
    const right = normalizeEnvelope(baseEnvelope);
    expect(diffSignatures(left, right)).toEqual([]);
  });

  it("reports an added signature", () => {
    const left = normalizeEnvelope(baseEnvelope);
    const right = normalizeEnvelope(baseEnvelope);
    right.signatures = ["0000000000000000:ff".repeat(3)];
    const diffs = diffSignatures(left, right);
    expect(diffs.length).toBe(1);
    expect(diffs[0].kind).toBe("added");
  });

  it("reports a removed signature", () => {
    const left = normalizeEnvelope(baseEnvelope);
    left.signatures = ["1111111111111111:ee".repeat(3)];
    const right = normalizeEnvelope(baseEnvelope);
    const diffs = diffSignatures(left, right);
    expect(diffs.length).toBe(1);
    expect(diffs[0].kind).toBe("removed");
  });
});

describe("isSignatureOnlyChange", () => {
  it("is true when only signatures differ", () => {
    expect(isSignatureOnlyChange(0, 0, [{ kind: "added", value: "x" }])).toBe(true);
  });

  it("is false when fields or operations differ", () => {
    expect(isSignatureOnlyChange(1, 0, [])).toBe(false);
    expect(isSignatureOnlyChange(0, 1, [])).toBe(false);
  });

  it("is false when no signatures differ", () => {
    expect(isSignatureOnlyChange(0, 0, [])).toBe(false);
  });
});
