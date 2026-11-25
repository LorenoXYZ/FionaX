import { describe, expect, it } from "vitest";
import { runSignerQuorumSimulator } from "@/app/tools/signer-quorum-simulator/lib/signerQuorumSimulator";
import { SignerSnapshotError } from "@/app/tools/signer-quorum-simulator/lib/signer-snapshot";
import { normalAccountJson, normalSelection } from "@/tests/tools/signer-quorum-simulator/fixtures/normal.fixture";
import {
  boundaryAccountJson,
  disabledMasterKeyJson,
  exactThresholdSelection,
  duplicateSelection
} from "@/tests/tools/signer-quorum-simulator/fixtures/boundary.fixture";
import {
  notJsonText,
  arrayJson,
  missingSignersJson,
  unsupportedSignerJson
} from "@/tests/tools/signer-quorum-simulator/fixtures/malformed.fixture";
import { incompleteAccountJson, incompleteSelection } from "@/tests/tools/signer-quorum-simulator/fixtures/incomplete.fixture";

describe("runSignerQuorumSimulator", () => {
  it("sums a valid selection and evaluates every threshold", () => {
    const result = runSignerQuorumSimulator({
      rawAccountJson: normalAccountJson,
      selectedKeys: normalSelection
    });

    expect(result.accountId).toBe("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ");
    // weights 1 + 2 = 3
    expect(result.verdicts.low.selectedWeight).toBe(3);
    expect(result.verdicts.low.reached).toBe(true);
    expect(result.verdicts.medium.reached).toBe(true);
    expect(result.verdicts.high.reached).toBe(true);
    expect(result.verdicts.high.shortfall).toBe(0);
    expect(result.unresolved).toEqual([]);
    expect(result.evidenceIncomplete).toBe(false);
  });

  it("reports a shortfall for an unreachable threshold", () => {
    const result = runSignerQuorumSimulator({
      rawAccountJson: boundaryAccountJson,
      selectedKeys: ["GCWYXRBKJYTHGCKTPNMFRVNWMFFUPQPCJSQSNOMLYPRDVRFJIDFPTB4I"]
    });

    // zero-weight signer selected -> selectedWeight 0
    expect(result.verdicts.low.reached).toBe(true); // threshold 0
    expect(result.verdicts.medium.reached).toBe(false);
    expect(result.verdicts.medium.shortfall).toBe(255);
  });

  it("treats an exact threshold as reached", () => {
    const result = runSignerQuorumSimulator({
      rawAccountJson: boundaryAccountJson,
      selectedKeys: exactThresholdSelection
    });

    // weight 255 -> medium threshold 255 reached exactly
    expect(result.verdicts.medium.selectedWeight).toBe(255);
    expect(result.verdicts.medium.reached).toBe(true);
    expect(result.verdicts.medium.shortfall).toBe(0);
  });

  it("counts a duplicate selection exactly once", () => {
    const result = runSignerQuorumSimulator({
      rawAccountJson: boundaryAccountJson,
      selectedKeys: duplicateSelection
    });

    expect(result.verdicts.low.selectedWeight).toBe(255);
    const contribution = result.contributions.find((c) => c.key === "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ");
    expect(contribution?.duplicate).toBe(true);
  });

  it("keeps a disabled master key distinct from a missing signer", () => {
    const result = runSignerQuorumSimulator({
      rawAccountJson: disabledMasterKeyJson,
      selectedKeys: ["GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ"]
    });

    // master key weight 0 -> low threshold 1 not reached
    expect(result.verdicts.low.reached).toBe(false);
    expect(result.verdicts.low.shortfall).toBe(1);
    expect(result.unresolved).toEqual([]);
  });

  it("flags selected keys that do not exist on the account", () => {
    const result = runSignerQuorumSimulator({
      rawAccountJson: normalAccountJson,
      selectedKeys: ["GCWYXRBKJYTHGCKTPNMFRVNWMFFUPQPCJSQSNOMLYPRDVRFJIDFPTB4I", "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"]
    });

    expect(result.unresolved).toEqual([
      { key: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" }
    ]);
  });

  it("marks missing weights and thresholds as incomplete evidence", () => {
    const result = runSignerQuorumSimulator({
      rawAccountJson: incompleteAccountJson,
      selectedKeys: incompleteSelection
    });

    expect(result.evidenceIncomplete).toBe(true);
    expect(result.verdicts.high.threshold).toBeNull();
    expect(result.verdicts.high.reached).toBe(false);
  });

  it("throws a typed error for non-JSON input", () => {
    expect(() =>
      runSignerQuorumSimulator({ rawAccountJson: notJsonText, selectedKeys: ["x"] })
    ).toThrow(SignerSnapshotError);
  });

  it("throws a typed error for a non-object JSON value", () => {
    expect(() =>
      runSignerQuorumSimulator({ rawAccountJson: arrayJson, selectedKeys: ["x"] })
    ).toThrow(SignerSnapshotError);
  });

  it("throws a typed error when the signers array is missing", () => {
    expect(() =>
      runSignerQuorumSimulator({ rawAccountJson: missingSignersJson, selectedKeys: ["x"] })
    ).toThrow(SignerSnapshotError);
  });

  it("throws an unsupported-variant error for an unknown signer key prefix", () => {
    let error: SignerSnapshotError | null = null;
    try {
      runSignerQuorumSimulator({ rawAccountJson: unsupportedSignerJson, selectedKeys: ["x"] });
    } catch (e) {
      error = e as SignerSnapshotError;
    }
    expect(error).toBeInstanceOf(SignerSnapshotError);
    expect(error?.code).toBe("unsupported_variant");
  });
});
