import { describe, expect, it } from "vitest";
import { normalizeEnvelope, EnvelopeDecodeError } from "@/app/tools/transaction-envelope-diff/lib/envelope-normalize";
import { baseEnvelope } from "@/tests/tools/transaction-envelope-diff/fixtures/normal.fixture";
import { base64NotXdr, base64WrongType } from "@/tests/tools/transaction-envelope-diff/fixtures/malformed.fixture";

describe("normalizeEnvelope", () => {
  it("normalizes a v1 envelope into a canonical shape", () => {
    const canon = normalizeEnvelope(baseEnvelope);
    expect(canon.kind).toBe("v1");
    expect(canon.sourceAccount).toBeTruthy();
    expect(canon.fee).toBeTruthy();
    expect(canon.seqNum).toBeTruthy();
    expect(canon.operations.length).toBe(1);
    expect(canon.signatures).toEqual([]);
  });

  it("throws malformed_data for non-XDR base64", () => {
    let error: EnvelopeDecodeError | null = null;
    try {
      normalizeEnvelope(base64NotXdr);
    } catch (e) {
      error = e as EnvelopeDecodeError;
    }
    expect(error).toBeInstanceOf(EnvelopeDecodeError);
    expect(error?.code).toBe("malformed_data");
  });

  it("throws malformed_data for a wrong XDR type", () => {
    expect(() => normalizeEnvelope(base64WrongType)).toThrow(EnvelopeDecodeError);
  });
});
