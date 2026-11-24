import { describe, expect, it } from "vitest";
import { formatLedger, formatRemaining } from "@/app/tools/soroban-storage-ttl-inspector/lib/format";
import type { StorageEntryResult } from "@/app/tools/soroban-storage-ttl-inspector/types";

const entry: StorageEntryResult = {
  id: "balance",
  contractId: "C",
  requestedDurability: "persistent",
  entryDurability: "persistent",
  status: "unknown",
  latestLedger: "100",
  liveUntilLedgerSeq: null,
  lastModifiedLedgerSeq: "40",
  remainingLedgers: null
};

describe("TTL formatting", () => {
  it("does not print a remaining count that was not calculated", () => {
    expect(formatRemaining(entry)).toBe("not declared");
    expect(formatLedger(null)).toBe("not declared");
    expect(formatRemaining({ ...entry, remainingLedgers: "9007199254740993" })).toBe("9007199254740993");
  });
});
