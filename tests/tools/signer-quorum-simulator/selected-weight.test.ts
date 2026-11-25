import { describe, expect, it } from "vitest";
import { computeSelectedWeight } from "@/app/tools/signer-quorum-simulator/lib/selected-weight";
import { parseSignerSnapshot } from "@/app/tools/signer-quorum-simulator/lib/signer-snapshot";
import { normalAccountJson } from "@/tests/tools/signer-quorum-simulator/fixtures/normal.fixture";
import { boundaryAccountJson } from "@/tests/tools/signer-quorum-simulator/fixtures/boundary.fixture";

const MASTER = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
const ED25519 = "GCWYXRBKJYTHGCKTPNMFRVNWMFFUPQPCJSQSNOMLYPRDVRFJIDFPTB4I";

describe("computeSelectedWeight", () => {
  it("sums each selected signer once", () => {
    const snapshot = parseSignerSnapshot(normalAccountJson);
    const result = computeSelectedWeight(snapshot, [MASTER, ED25519]);

    expect(result.totalWeight).toBe(3);
    expect(result.contributions).toHaveLength(2);
    expect(result.unresolved).toEqual([]);
  });

  it("deduplicates a repeated key", () => {
    const snapshot = parseSignerSnapshot(normalAccountJson);
    const result = computeSelectedWeight(snapshot, [MASTER, MASTER]);

    expect(result.totalWeight).toBe(1);
    expect(result.contributions).toHaveLength(1);
    expect(result.contributions[0].duplicate).toBe(true);
  });

  it("separates unresolved keys from zero-weight signers", () => {
    const snapshot = parseSignerSnapshot(normalAccountJson);
    const result = computeSelectedWeight(snapshot, ["GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"]);

    expect(result.totalWeight).toBe(0);
    expect(result.unresolved).toEqual([
      { key: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" }
    ]);
    expect(result.hasUnknownWeight).toBe(false);
  });

  it("flags an unknown weight without treating it as zero", () => {
    const snapshot = parseSignerSnapshot(boundaryAccountJson);
    // ED25519 signer has weight 0; that is a real zero, not unknown.
    const result = computeSelectedWeight(snapshot, [ED25519]);
    expect(result.totalWeight).toBe(0);
    expect(result.hasUnknownWeight).toBe(false);
    expect(result.contributions[0].weight).toBe(0);
  });
});
