import { describe, expect, it, vi } from "vitest";
import { inspectFeeBump } from "@/app/tools/fee-bump-envelope-inspector/lib/feeBumpEnvelopeInspector";
import { makeEnvelope, passphrase, innerKey } from "./fixtures/normal.fixture";
import { withoutInnerSignature, withoutOuterSignature } from "./fixtures/incomplete.fixture";
import { highValues, muxedPayer } from "./fixtures/boundary.fixture";
describe("inspectFeeBump", () => {
  it("keeps outer and inner identities and signatures distinct without requests", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    try {
      const { envelope, outer, inner, payer } = makeEnvelope();
      const result = inspectFeeBump({ envelope, passphrase });
      expect(result.feeSource).toBe(payer);
      expect(result.innerSource).toBe(innerKey.publicKey());
      expect(result.outerHash).toBe(outer.hash().toString("hex"));
      expect(result.innerHash).toBe(inner.hash().toString("hex"));
      expect(result.operations.map((op) => op.type)).toEqual(["manageData"]);
      expect(result.innerSignatures).toHaveLength(1);
      expect(result.outerSignatures).toHaveLength(1);
      expect(result.evidence).toBe("complete");
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally { fetchSpy.mockRestore(); }
  });
  it("marks each absent signature layer as incomplete", () => {
    for (const { envelope } of [withoutInnerSignature(), withoutOuterSignature()]) {
      expect(inspectFeeBump({ envelope, passphrase }).evidence).toBe("incomplete");
    }
  });
  it("preserves a muxed payer and high sequence and fee values", () => {
    const muxed = muxedPayer();
    expect(inspectFeeBump({ envelope: muxed.envelope, passphrase }).feeSource).toBe(muxed.payer);
    const high = highValues();
    const result = inspectFeeBump({ envelope: high.envelope, passphrase });
    expect(result.innerSequence).toBe("9223372036854775807");
    expect(result.feeStroops).toBe(high.outer.fee);
  });
  it("changes both hashes with the passphrase", () => {
    const { envelope } = makeEnvelope();
    const first = inspectFeeBump({ envelope, passphrase });
    const second = inspectFeeBump({ envelope, passphrase: "another network" });
    expect(second.innerHash).not.toBe(first.innerHash);
    expect(second.outerHash).not.toBe(first.outerHash);
  });
});
