import { describe, expect, it } from "vitest";
import { readEventFilterInput } from "@/app/tools/soroban-event-filter-builder/lib/event-filter-input";
import { exactRange, maxSegments } from "@/tests/tools/soroban-event-filter-builder/fixtures/boundary.fixture";
import { badContract, invertedRange } from "@/tests/tools/soroban-event-filter-builder/fixtures/malformed.fixture";
import { contractA, contractB, normalFilter } from "@/tests/tools/soroban-event-filter-builder/fixtures/normal.fixture";

describe("readEventFilterInput", () => {
  it("keeps two contract IDs in one filter", () => {
    const result = readEventFilterInput(normalFilter);
    expect(result.ok && result.input.filters[0]?.contractIds).toEqual([contractA, contractB]);
  });

  it("accepts an exclusive range of one ledger", () => {
    const result = readEventFilterInput(exactRange);
    expect(result.ok && result.input.startLedger).toBe("50");
    expect(result.ok && result.input.endLedger).toBe("51");
  });

  it("rejects an invalid contract checksum and an empty range", () => {
    expect(readEventFilterInput(badContract).ok).toBe(false);
    const range = readEventFilterInput(invertedRange);
    expect(range.ok).toBe(false);
    if (!range.ok) expect(range.error.code).toBe("invalid_input");
  });

  it("accepts four segments plus a trailing multi wildcard", () => {
    expect(readEventFilterInput(maxSegments).ok).toBe(true);
  });
});
