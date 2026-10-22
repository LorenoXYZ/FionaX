import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import { validateSequenceInspectorInput } from "@/app/tools/sequence-inspector/schema";
import { accountId } from "@/tests/tools/sequence-inspector/fixtures/account-sequence.fixture";

describe("validateSequenceInspectorInput", () => {
  it("rejects empty input", () => {
    const result = validateSequenceInspectorInput("  ");
    expect(result.ok).toBe(false);
  });

  it("trims and accepts a valid account ID", () => {
    const result = validateSequenceInspectorInput(`  ${accountId}  `);
    expect(result.ok).toBe(true);
    expect(result.ok && result.input.accountId).toBe(accountId);
  });

  it("rejects a malformed account ID", () => {
    expect(validateSequenceInspectorInput("GABC").ok).toBe(false);
  });

  it("rejects a secret key before any request", () => {
    const seed = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 9)).secret();
    const result = validateSequenceInspectorInput(seed);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain(seed);
  });
});
