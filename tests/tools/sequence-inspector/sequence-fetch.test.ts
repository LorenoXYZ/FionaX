import { describe, expect, it } from "vitest";
import { fetchAccountSequence } from "@/app/tools/sequence-inspector/lib/sequence-fetch";
import {
  accountId,
  accountSequenceLoader,
  currentSequence
} from "@/tests/tools/sequence-inspector/fixtures/account-sequence.fixture";
import { highCurrentSequence, highSequenceLoader } from "@/tests/tools/sequence-inspector/fixtures/high-sequence.fixture";
import { missingAccountId, missingAccountLoader } from "@/tests/tools/sequence-inspector/fixtures/missing-account.fixture";

describe("fetchAccountSequence", () => {
  it("returns the account's sequence number as a string", async () => {
    const sequence = await fetchAccountSequence(accountId, "testnet", accountSequenceLoader);
    expect(sequence).toBe(currentSequence);
    expect(typeof sequence).toBe("string");
  });

  it("returns a 64-bit sequence number exactly, without precision loss", async () => {
    const sequence = await fetchAccountSequence("ignored-in-fixture", "testnet", highSequenceLoader);
    expect(sequence).toBe(highCurrentSequence);
  });

  it("propagates a loader failure (e.g. account not found) instead of swallowing it", async () => {
    await expect(fetchAccountSequence(missingAccountId, "testnet", missingAccountLoader)).rejects.toThrow();
  });
});
