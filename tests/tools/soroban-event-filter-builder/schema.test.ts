import { Keypair } from "@stellar/stellar-sdk";
import { describe, expect, it } from "vitest";
import { MAX_FILTER_JSON_LENGTH, validateEventFilterInput } from "@/app/tools/soroban-event-filter-builder/schema";
import { notJson } from "@/tests/tools/soroban-event-filter-builder/fixtures/malformed.fixture";
import { normalJson } from "@/tests/tools/soroban-event-filter-builder/fixtures/normal.fixture";

describe("validateEventFilterInput", () => {
  it("accepts the normal filter", () => {
    expect(validateEventFilterInput(normalJson()).ok).toBe(true);
  });

  it("rejects empty, secret, oversized, and broken JSON", () => {
    expect(validateEventFilterInput("  ").ok).toBe(false);
    const secret = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 5)).secret();
    const seeded = validateEventFilterInput(secret);
    expect(seeded.ok).toBe(false);
    expect(JSON.stringify(seeded)).not.toContain(secret);
    expect(validateEventFilterInput("x".repeat(MAX_FILTER_JSON_LENGTH + 1)).ok).toBe(false);
    expect(validateEventFilterInput(notJson).ok).toBe(false);
  });
});
