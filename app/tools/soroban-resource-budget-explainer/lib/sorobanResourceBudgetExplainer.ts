import { summarizeFootprint } from "@/app/tools/soroban-resource-budget-explainer/lib/footprint-summary";
import { collectFees, decodeTransactionData, readEnvelopeFee } from "@/app/tools/soroban-resource-budget-explainer/lib/resource-metrics";
import { normalizeSimulation } from "@/app/tools/soroban-resource-budget-explainer/lib/simulation-result";
import type { BudgetError, BudgetInput, BudgetResult } from "@/app/tools/soroban-resource-budget-explainer/types";

export function runSorobanResourceBudgetExplainer(input: BudgetInput): { ok: true; result: BudgetResult } | { ok: false; error: BudgetError } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input.simulationJson);
  } catch {
    return { ok: false, error: { code: "malformed_data", message: "The simulation paste is not JSON." } };
  }
  const simulation = normalizeSimulation(parsed);
  if (!simulation.ok) return simulation;
  const source = simulation.simulation.outcome === "restore"
    ? simulation.simulation.restoreTransactionData ?? simulation.simulation.transactionData
    : simulation.simulation.transactionData;
  const decoded = decodeTransactionData(source);
  if (!decoded.ok) return decoded;
  const envelope = readEnvelopeFee(input.envelopeXdr);
  if (!envelope.ok) return envelope;
  const missing: string[] = decoded.decoded.metrics.filter((metric) => metric.value === null).map((metric) => metric.name);
  if (!simulation.simulation.minResourceFee) missing.push("minResourceFee");
  if (!envelope.fee) missing.push("envelopeFee");
  let footprint;
  try {
    footprint = summarizeFootprint(decoded.decoded.footprintXdr);
  } catch {
    return { ok: false, error: { code: "malformed_data", message: "A footprint key is not ledger-key XDR." } };
  }
  return {
    ok: true,
    result: {
      outcome: simulation.simulation.outcome,
      metrics: decoded.decoded.metrics,
      fees: collectFees(simulation.simulation, decoded.decoded.resourceFee, envelope.fee),
      footprint,
      completeness: missing.length === 0 ? "complete" : "incomplete",
      missing,
      failureMessage: simulation.simulation.failureMessage
    }
  };
}
