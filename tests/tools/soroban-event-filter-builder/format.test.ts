import { describe, expect, it } from "vitest";
import { formatLedger, formatTopic } from "@/app/tools/soroban-event-filter-builder/lib/format";

describe("event filter formatting", () => {
  it("does not replace a missing ledger with zero", () => {
    expect(formatLedger(null)).toBe("not declared");
    expect(formatLedger("1000")).toBe("1000");
  });

  it("keeps segment positions visible", () => {
    expect(formatTopic([
      { position: 0, kind: "exact", text: "AAAA", source: "symbol:transfer" },
      { position: 1, kind: "single", text: "*", source: "*" }
    ])).toBe("0:symbol:transfer 1:*");
  });
});
