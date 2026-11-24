import type { BudgetError, BudgetInput } from "@/app/tools/soroban-resource-budget-explainer/types";

export const MAX_SIMULATION_LENGTH = 100_000;
const SECRET_SEED = /^S[A-Z2-7]{55}$/;

export function validateBudgetInput(raw: { simulationJson: string; envelopeXdr: string }): { ok: true; input: BudgetInput } | { ok: false; error: BudgetError } {
  const simulationJson = raw.simulationJson.trim();
  const envelopeXdr = raw.envelopeXdr.trim();
  if (!simulationJson) {
    return { ok: false, error: { code: "invalid_input", message: "Paste a simulateTransaction response." } };
  }
  if ([simulationJson, envelopeXdr].some((value) => value.split(/\s+/).some((token) => SECRET_SEED.test(token)))) {
    return { ok: false, error: { code: "invalid_input", message: "A secret seed was rejected and was not stored." } };
  }
  if (simulationJson.length > MAX_SIMULATION_LENGTH || envelopeXdr.length > MAX_SIMULATION_LENGTH) {
    return { ok: false, error: { code: "too_large", message: "Keep each paste under 100,000 characters." } };
  }
  return { ok: true, input: { simulationJson, envelopeXdr: envelopeXdr || null } };
}
