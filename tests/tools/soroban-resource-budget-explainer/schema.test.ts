import { Keypair } from "@stellar/stellar-sdk";
import { describe, expect, it } from "vitest";
import { MAX_SIMULATION_LENGTH, validateBudgetInput } from "@/app/tools/soroban-resource-budget-explainer/schema";
import { notJson } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/malformed.fixture";
import { successSimulation } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/normal.fixture";

describe("validateBudgetInput", () => {
  it("accepts a simulation without an envelope", () => {
    expect(validateBudgetInput({ simulationJson: successSimulation(), envelopeXdr: "" }).ok).toBe(true);
  });

  it("rejects empty, secret, and oversized input", () => {
    expect(validateBudgetInput({ simulationJson: " ", envelopeXdr: "" }).ok).toBe(false);
    const secret = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 6)).secret();
    const rejected = validateBudgetInput({ simulationJson: secret, envelopeXdr: "" });
    expect(JSON.stringify(rejected)).not.toContain(secret);
    expect(validateBudgetInput({ simulationJson: "x".repeat(MAX_SIMULATION_LENGTH + 1), envelopeXdr: "" }).ok).toBe(false);
    expect(notJson).toBe("{");
  });
});
