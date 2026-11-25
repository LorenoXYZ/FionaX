import { describe, expect, it } from "vitest";
import { diffFields, diffOperations } from "@/app/tools/transaction-envelope-diff/lib/semantic-diff";
import { normalizeEnvelope } from "@/app/tools/transaction-envelope-diff/lib/envelope-normalize";
import { baseEnvelope, changedAmountEnvelope, changedSeqEnvelope } from "@/tests/tools/transaction-envelope-diff/fixtures/normal.fixture";

describe("diffFields", () => {
  it("returns no diffs for identical envelopes", () => {
    const left = normalizeEnvelope(baseEnvelope);
    const right = normalizeEnvelope(baseEnvelope);
    expect(diffFields(left, right)).toEqual([]);
  });

  it("reports a changed sequence number", () => {
    const left = normalizeEnvelope(baseEnvelope);
    const right = normalizeEnvelope(changedSeqEnvelope);
    const diffs = diffFields(left, right);
    expect(diffs.some((d) => d.path === "seqNum" && d.kind === "changed")).toBe(true);
  });
});

describe("diffOperations", () => {
  it("returns no diffs for identical operations", () => {
    const left = normalizeEnvelope(baseEnvelope);
    const right = normalizeEnvelope(baseEnvelope);
    expect(diffOperations(left, right)).toEqual([]);
  });

  it("reports a changed operation", () => {
    const left = normalizeEnvelope(baseEnvelope);
    const right = normalizeEnvelope(changedAmountEnvelope);
    const diffs = diffOperations(left, right);
    expect(diffs.length).toBe(1);
    expect(diffs[0].kind).toBe("changed");
  });
});
