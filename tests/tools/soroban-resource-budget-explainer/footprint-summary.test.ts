import { describe, expect, it } from "vitest";
import { summarizeFootprint } from "@/app/tools/soroban-resource-budget-explainer/lib/footprint-summary";
import { decodeTransactionData } from "@/app/tools/soroban-resource-budget-explainer/lib/resource-metrics";
import { contractId, transactionDataXdr } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/normal.fixture";

describe("summarizeFootprint", () => {
  it("keeps the contract id and persistent durability", () => {
    const decoded = decodeTransactionData(transactionDataXdr());
    if (!decoded.ok || !decoded.decoded.footprintXdr) throw new Error("expected footprint");
    const rows = summarizeFootprint(decoded.decoded.footprintXdr);
    expect(rows[0]).toMatchObject({ access: "readOnly", durability: "persistent", contractId, supported: true });
  });
});
