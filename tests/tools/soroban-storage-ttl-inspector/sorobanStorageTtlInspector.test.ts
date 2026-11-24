import { describe, expect, it } from "vitest";
import { runSorobanStorageTtlInspector } from "@/app/tools/soroban-storage-ttl-inspector/lib/sorobanStorageTtlInspector";
import { oneLedgerLeftBody } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/boundary.fixture";
import { jsonResponse, persistentKey } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/normal.fixture";

describe("runSorobanStorageTtlInspector", () => {
  it("reports one remaining ledger from the returned ledger", async () => {
    const result = await runSorobanStorageTtlInspector(
      { network: "testnet", keys: [persistentKey] },
      { fetchImpl: async () => jsonResponse(oneLedgerLeftBody()) }
    );
    expect(result.ok && result.result.entries[0]?.remainingLedgers).toBe("1");
    expect(result.ok && result.result.provider).toBe("soroban-rpc");
    expect(result.ok && result.result.completeness).toBe("complete");
  });
});
