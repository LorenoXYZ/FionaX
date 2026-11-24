import { describe, expect, it } from "vitest";
import { normalizeSimulation } from "@/app/tools/soroban-resource-budget-explainer/lib/simulation-result";
import { largeFeeSimulation } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/boundary.fixture";
import { restoreSimulation } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/incomplete.fixture";
import { successSimulation } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/normal.fixture";

describe("normalizeSimulation", () => {
  it("keeps a successful simulation separate from a restore preamble", () => {
    const success = normalizeSimulation(JSON.parse(successSimulation()));
    const restore = normalizeSimulation(JSON.parse(restoreSimulation));
    expect(success.ok && success.simulation.outcome).toBe("success");
    expect(restore.ok && restore.simulation.outcome).toBe("restore");
  });

  it("keeps a large minimum fee as an integer string", () => {
    const result = normalizeSimulation(JSON.parse(largeFeeSimulation()));
    expect(result.ok && result.simulation.minResourceFee).toBe("9007199254740993");
  });

  it("records a failure without inventing metrics", () => {
    const result = normalizeSimulation({ error: "HostError" });
    expect(result.ok && result.simulation.outcome).toBe("failure");
    expect(result.ok && result.simulation.transactionData).toBeNull();
  });
});
