import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import { validateTrustlineCapacityInput } from "@/app/tools/trustline-capacity-planner/schema";
import { accountId, issuerId } from "@/tests/tools/trustline-capacity-planner/fixtures/normal.fixture";

const RECORD = '{"balance":"1.0000000"}';

describe("validateTrustlineCapacityInput", () => {
  it("rejects empty fields", () => {
    const result = validateTrustlineCapacityInput("", "", "", "");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("invalid_input");
  });

  it("accepts valid identifiers and a pasted record", () => {
    const result = validateTrustlineCapacityInput(accountId, "USDC", issuerId, RECORD);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.input.accountId).toBe(accountId);
    expect(result.input.assetCode).toBe("USDC");
    expect(result.input.issuerId).toBe(issuerId);
  });

  it("rejects a malformed account ID", () => {
    const result = validateTrustlineCapacityInput("GABC", "USDC", issuerId, RECORD);
    expect(result.ok).toBe(false);
  });

  it("rejects a secret seed as the account before any work", () => {
    const seed = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 9)).secret();
    const result = validateTrustlineCapacityInput(seed, "USDC", issuerId, RECORD);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain(seed);
  });

  it("rejects a secret seed as the issuer before any work", () => {
    const seed = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 9)).secret();
    const result = validateTrustlineCapacityInput(accountId, "USDC", seed, RECORD);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain(seed);
  });

  it("rejects an overlong asset code", () => {
    const result = validateTrustlineCapacityInput(accountId, "TOOLONGCODE13", issuerId, RECORD);
    expect(result.ok).toBe(false);
  });

  it("rejects an oversized record as too_large", () => {
    const huge = JSON.stringify({ balance: "1.0000000", pad: "x".repeat(20_001) });
    const result = validateTrustlineCapacityInput(accountId, "USDC", issuerId, huge);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("too_large");
  });
});
