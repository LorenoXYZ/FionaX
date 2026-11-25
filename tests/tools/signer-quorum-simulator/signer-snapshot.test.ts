import { describe, expect, it } from "vitest";
import { parseSignerSnapshot, SignerSnapshotError } from "@/app/tools/signer-quorum-simulator/lib/signer-snapshot";
import { normalAccountJson } from "@/tests/tools/signer-quorum-simulator/fixtures/normal.fixture";
import {
  missingSignersJson,
  missingThresholdsJson,
  unsupportedSignerJson
} from "@/tests/tools/signer-quorum-simulator/fixtures/malformed.fixture";
import { incompleteAccountJson } from "@/tests/tools/signer-quorum-simulator/fixtures/incomplete.fixture";

describe("parseSignerSnapshot", () => {
  it("parses a valid account into a stable snapshot", () => {
    const snapshot = parseSignerSnapshot(normalAccountJson);

    expect(snapshot.accountId).toBe("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ");
    expect(snapshot.thresholds).toEqual({ low: 1, medium: 2, high: 3 });
    expect(snapshot.signers).toHaveLength(3);

    const ed25519 = snapshot.signers.find((s) => s.key === "GCWYXRBKJYTHGCKTPNMFRVNWMFFUPQPCJSQSNOMLYPRDVRFJIDFPTB4I");
    expect(ed25519?.type).toBe("ed25519");
    expect(ed25519?.weight).toBe(2);
    expect(ed25519?.isMasterKey).toBe(false);

    const hashSigner = snapshot.signers.find((s) => s.key.startsWith("X"));
    expect(hashSigner?.type).toBe("sha256_hash");
  });

  it("normalizes a missing signer weight to null, not zero", () => {
    const snapshot = parseSignerSnapshot(incompleteAccountJson);

    const signer = snapshot.signers.find((s) => s.key === "GCWYXRBKJYTHGCKTPNMFRVNWMFFUPQPCJSQSNOMLYPRDVRFJIDFPTB4I");
    expect(signer?.weight).toBeNull();
    expect(snapshot.thresholds.high).toBeNull();
  });

  it("throws malformed_data when signers are missing", () => {
    expect(() => parseSignerSnapshot(missingSignersJson)).toThrow(SignerSnapshotError);
  });

  it("throws malformed_data when thresholds are missing", () => {
    expect(() => parseSignerSnapshot(missingThresholdsJson)).toThrow(SignerSnapshotError);
  });

  it("throws unsupported_variant for an unknown key prefix", () => {
    let error: SignerSnapshotError | null = null;
    try {
      parseSignerSnapshot(unsupportedSignerJson);
    } catch (e) {
      error = e as SignerSnapshotError;
    }
    expect(error?.code).toBe("unsupported_variant");
  });
});
