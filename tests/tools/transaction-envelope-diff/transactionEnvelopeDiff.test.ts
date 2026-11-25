import { describe, expect, it } from "vitest";
import { runTransactionEnvelopeDiff } from "@/app/tools/transaction-envelope-diff/lib/transactionEnvelopeDiff";
import { EnvelopeDecodeError } from "@/app/tools/transaction-envelope-diff/lib/envelope-normalize";
import {
  baseEnvelope,
  changedAmountEnvelope,
  changedSeqEnvelope
} from "@/tests/tools/transaction-envelope-diff/fixtures/normal.fixture";
import {
  twoOpEnvelope,
  reorderedEnvelope,
  largeSeqEnvelope
} from "@/tests/tools/transaction-envelope-diff/fixtures/boundary.fixture";
import {
  notBase64,
  base64NotXdr,
  base64WrongType
} from "@/tests/tools/transaction-envelope-diff/fixtures/malformed.fixture";
import { noMemoEnvelope, textMemoEnvelope } from "@/tests/tools/transaction-envelope-diff/fixtures/incomplete.fixture";

describe("runTransactionEnvelopeDiff", () => {
  it("reports identical envelopes as identical", () => {
    const result = runTransactionEnvelopeDiff({ leftEnvelope: baseEnvelope, rightEnvelope: baseEnvelope });
    expect(result.identical).toBe(true);
    expect(result.fieldDiffs).toEqual([]);
    expect(result.operationDiffs).toEqual([]);
    expect(result.signatureDiffs).toEqual([]);
  });

  it("detects an operation amount change", () => {
    const result = runTransactionEnvelopeDiff({
      leftEnvelope: baseEnvelope,
      rightEnvelope: changedAmountEnvelope
    });
    expect(result.identical).toBe(false);
    expect(result.operationDiffs.length).toBeGreaterThan(0);
    expect(result.operationDiffs[0].kind).toBe("changed");
  });

  it("detects a sequence number change as a field diff", () => {
    const result = runTransactionEnvelopeDiff({
      leftEnvelope: baseEnvelope,
      rightEnvelope: changedSeqEnvelope
    });
    expect(result.identical).toBe(false);
    expect(result.fieldDiffs.some((d) => d.path === "seqNum")).toBe(true);
  });

  it("detects reordered operations in order", () => {
    const result = runTransactionEnvelopeDiff({
      leftEnvelope: twoOpEnvelope,
      rightEnvelope: reorderedEnvelope
    });
    expect(result.identical).toBe(false);
    expect(result.operationDiffs.length).toBeGreaterThan(0);
  });

  it("handles a large sequence number without precision loss", () => {
    const result = runTransactionEnvelopeDiff({
      leftEnvelope: largeSeqEnvelope,
      rightEnvelope: largeSeqEnvelope
    });
    expect(result.identical).toBe(true);
  });

  it("distinguishes an absent memo from a present one", () => {
    const result = runTransactionEnvelopeDiff({
      leftEnvelope: noMemoEnvelope,
      rightEnvelope: textMemoEnvelope
    });
    expect(result.identical).toBe(false);
    expect(result.fieldDiffs.some((d) => d.path === "memo")).toBe(true);
  });

  it("throws a malformed_data error for non-XDR base64", () => {
    expect(() =>
      runTransactionEnvelopeDiff({ leftEnvelope: base64NotXdr, rightEnvelope: baseEnvelope })
    ).toThrow(EnvelopeDecodeError);
  });

  it("throws a malformed_data error for a wrong XDR type", () => {
    let error: EnvelopeDecodeError | null = null;
    try {
      runTransactionEnvelopeDiff({ leftEnvelope: base64WrongType, rightEnvelope: baseEnvelope });
    } catch (e) {
      error = e as EnvelopeDecodeError;
    }
    expect(error).toBeInstanceOf(EnvelopeDecodeError);
  });
});

describe("runTransactionEnvelopeDiff invalid input via schema path", () => {
  it("rejects non-base64 via the schema (indirectly, decode fails)", () => {
    // The schema rejects non-base64 before decode; here we confirm the decode
    // layer also refuses when bypassed.
    expect(() =>
      runTransactionEnvelopeDiff({ leftEnvelope: notBase64, rightEnvelope: baseEnvelope })
    ).toThrow(EnvelopeDecodeError);
  });
});
