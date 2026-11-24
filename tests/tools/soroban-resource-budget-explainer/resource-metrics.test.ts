import { describe, expect, it } from "vitest";
import { decodeTransactionData, readEnvelopeFee } from "@/app/tools/soroban-resource-budget-explainer/lib/resource-metrics";
import { envelopeXdr, LARGE_FEE, transactionDataXdr } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/normal.fixture";

describe("resource metrics", () => {
  it("reads instruction, read, and write units from transaction data", () => {
    const decoded = decodeTransactionData(transactionDataXdr());
    expect(decoded.ok && decoded.decoded.metrics.map((metric) => `${metric.value} ${metric.unit}`)).toEqual([
      "1000 CPU instructions",
      "200 bytes",
      "50 bytes"
    ]);
    expect(decoded.ok && decoded.decoded.resourceFee).toBe(LARGE_FEE);
  });

  it("leaves metrics undeclared when transaction data is absent", () => {
    const decoded = decodeTransactionData(null);
    expect(decoded.ok && decoded.decoded.metrics.every((metric) => metric.value === null)).toBe(true);
  });

  it("reads the envelope fee separately from the resource fee", () => {
    expect(readEnvelopeFee(envelopeXdr()).ok && readEnvelopeFee(envelopeXdr()).ok).toBe(true);
    const fee = readEnvelopeFee(envelopeXdr());
    expect(fee.ok && fee.fee).toBe("100");
  });
});
