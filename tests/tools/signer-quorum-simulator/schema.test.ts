import { describe, expect, it } from "vitest";
import { validateSignerQuorumSimulatorInput } from "@/app/tools/signer-quorum-simulator/schema";
import { normalAccountJson } from "@/tests/tools/signer-quorum-simulator/fixtures/normal.fixture";
import { secretSeedJson } from "@/tests/tools/signer-quorum-simulator/fixtures/malformed.fixture";

describe("validateSignerQuorumSimulatorInput", () => {
  it("rejects empty account JSON", () => {
    const result = validateSignerQuorumSimulatorInput("  ", "key");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_input");
  });

  it("rejects an empty selection", () => {
    const result = validateSignerQuorumSimulatorInput(normalAccountJson, "   ");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_input");
  });

  it("rejects secret seeds before any decode", () => {
    const result = validateSignerQuorumSimulatorInput(secretSeedJson, "key");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_input");
  });

  it("rejects secret seeds in the selection", () => {
    const result = validateSignerQuorumSimulatorInput(normalAccountJson, secretSeedJson);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_input");
  });

  it("rejects oversized account JSON", () => {
    const big = JSON.stringify({ id: "x", signers: [], thresholds: {}, pad: "a".repeat(200_001) });
    const result = validateSignerQuorumSimulatorInput(big, "key");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("too_large");
  });

  it("splits a selection on commas and whitespace and trims keys", () => {
    const result = validateSignerQuorumSimulatorInput(normalAccountJson, "  keyA, keyB   keyC ");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.input.selectedKeys).toEqual(["keyA", "keyB", "keyC"]);
    }
  });
});
