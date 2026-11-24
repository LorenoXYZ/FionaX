import { Keypair } from "@stellar/stellar-sdk";
import { describe, expect, it } from "vitest";
import { MAX_KEYS, validateTtlInput } from "@/app/tools/soroban-storage-ttl-inspector/schema";
import { contractId, persistentKey } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/normal.fixture";

describe("validateTtlInput", () => {
  it("accepts one explicit key", () => {
    const result = validateTtlInput(JSON.stringify({ network: "testnet", keys: [{ ...persistentKey, key: { type: "symbol", value: "Balance" } }] }));
    expect(result.ok).toBe(true);
  });

  it("rejects a secret, a 21st key, and broken JSON", () => {
    const secret = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 8)).secret();
    expect(JSON.stringify(validateTtlInput(secret))).not.toContain(secret);
    const many = Array.from({ length: MAX_KEYS + 1 }, (_, index) => ({
      id: `k${index}`,
      contractId,
      durability: "persistent",
      key: { type: "symbol", value: "Balance" }
    }));
    const tooMany = validateTtlInput(JSON.stringify({ network: "testnet", keys: many }));
    expect(tooMany.ok).toBe(false);
    if (!tooMany.ok) expect(tooMany.error.code).toBe("too_large");
    expect(validateTtlInput("{").ok).toBe(false);
  });
});
