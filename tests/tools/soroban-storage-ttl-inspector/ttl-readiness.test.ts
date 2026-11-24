import { describe, expect, it } from "vitest";
import { classifyTtl } from "@/app/tools/soroban-storage-ttl-inspector/lib/ttl-readiness";
import { entryXdr } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/normal.fixture";

const base = { id: "balance", contractId: "C", requestedDurability: "persistent" as const, latestLedger: "100" };

describe("classifyTtl", () => {
  it("does not invent remaining ledgers when liveUntil is missing", () => {
    const row = classifyTtl({ ...base, liveUntilLedgerSeq: null, entryXdr: entryXdr() });
    expect(row.status).toBe("unknown");
    expect(row.remainingLedgers).toBeNull();
  });

  it("treats the exact live-until ledger as expired", () => {
    const row = classifyTtl({ ...base, liveUntilLedgerSeq: "100", entryXdr: entryXdr() });
    expect(row.status).toBe("expired");
    expect(row.remainingLedgers).toBeNull();
  });

  it("subtracts with an integer when one ledger remains", () => {
    const row = classifyTtl({ ...base, liveUntilLedgerSeq: "101", entryXdr: entryXdr() });
    expect(row.status).toBe("live");
    expect(row.remainingLedgers).toBe("1");
    expect(row.lastModifiedLedgerSeq).toBe("40");
  });

  it("keeps a missing entry absent", () => {
    expect(classifyTtl({ ...base, liveUntilLedgerSeq: null, entryXdr: null }).status).toBe("absent");
  });
});
