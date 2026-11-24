import { describe, expect, it } from "vitest";
import { fetchLedgerEntries } from "@/app/tools/soroban-storage-ttl-inspector/lib/ledger-entry-fetch";
import { badEntryBody } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/malformed.fixture";
import { mixedBody } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/incomplete.fixture";
import { encoded, jsonResponse, persistentKey, temporaryKey } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/normal.fixture";
import { encodeStorageKey } from "@/app/tools/soroban-storage-ttl-inspector/lib/storage-key-input";

describe("fetchLedgerEntries", () => {
  it("returns a present key and an absent key from one response", async () => {
    const mixed = mixedBody();
    const missing = encodeStorageKey(temporaryKey);
    if (!missing.ok) throw new Error(missing.error.message);
    const result = await fetchLedgerEntries("testnet", [encoded(persistentKey), missing.encoded], {
      fetchImpl: async () => jsonResponse(mixed.body)
    });
    expect(result.ok && result.entries.map((entry) => entry.status)).toEqual(["live", "absent"]);
  });

  it("keeps a bad entry XDR on that row", async () => {
    const result = await fetchLedgerEntries("testnet", [encoded()], { fetchImpl: async () => jsonResponse(badEntryBody()) });
    expect(result.ok && result.entries[0]?.status).toBe("malformed");
  });

  it("maps HTTP 429 to rate_limited", async () => {
    const result = await fetchLedgerEntries("mainnet", [encoded()], { fetchImpl: async () => jsonResponse({}, 429) });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("rate_limited");
  });
});
