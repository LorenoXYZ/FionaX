import { describe, expect, it } from "vitest";
import { runSorobanResourceBudgetExplainer } from "@/app/tools/soroban-resource-budget-explainer/lib/sorobanResourceBudgetExplainer";
import { badFootprint } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/malformed.fixture";
import { missingMetrics } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/incomplete.fixture";
import { envelopeXdr, successSimulation } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/normal.fixture";

describe("runSorobanResourceBudgetExplainer", () => {
  it("explains a successful simulation and keeps the envelope fee distinct", () => {
    const result = runSorobanResourceBudgetExplainer({ simulationJson: successSimulation(), envelopeXdr: envelopeXdr() });
    expect(result.ok && result.result.outcome).toBe("success");
    expect(result.ok && result.result.fees.find((fee) => fee.name === "envelopeFee")?.value).toBe("100");
    expect(result.ok && result.result.fees.find((fee) => fee.name === "minResourceFee")?.value).toBe("250");
    expect(result.ok && result.result.completeness).toBe("complete");
  });

  it("marks a failure with no metrics as incomplete", () => {
    const result = runSorobanResourceBudgetExplainer({ simulationJson: missingMetrics, envelopeXdr: null });
    expect(result.ok && result.result.outcome).toBe("failure");
    expect(result.ok && result.result.completeness).toBe("incomplete");
  });

  it("rejects malformed transaction data", () => {
    const result = runSorobanResourceBudgetExplainer({ simulationJson: badFootprint, envelopeXdr: null });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("malformed_data");
  });
});
