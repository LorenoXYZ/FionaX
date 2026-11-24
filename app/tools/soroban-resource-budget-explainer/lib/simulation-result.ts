import type { BudgetError, SimulationOutcome } from "@/app/tools/soroban-resource-budget-explainer/types";

export interface NormalizedSimulation {
  outcome: SimulationOutcome;
  transactionData: string | null;
  minResourceFee: string | null;
  restoreTransactionData: string | null;
  restoreMinResourceFee: string | null;
  failureMessage: string | null;
}

function fail(code: BudgetError["code"], message: string): { ok: false; error: BudgetError } {
  return { ok: false, error: { code, message } };
}

function integerString(value: unknown): string | null | "bad" {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) return String(value);
  if (typeof value === "string" && /^(0|[1-9][0-9]*)$/.test(value)) return value;
  return "bad";
}

function xdrString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function normalizeSimulation(parsed: unknown): { ok: true; simulation: NormalizedSimulation } | { ok: false; error: BudgetError } {
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return fail("malformed_data", "Paste a simulateTransaction result object.");
  }
  const root = parsed as Record<string, unknown>;
  const body = typeof root.result === "object" && root.result !== null ? (root.result as Record<string, unknown>) : root;
  const restore = typeof body.restorePreamble === "object" && body.restorePreamble !== null
    ? (body.restorePreamble as Record<string, unknown>)
    : null;
  const errorText = typeof body.error === "string" ? body.error : null;
  const outcome: SimulationOutcome = restore ? "restore" : errorText || body.status === "error" ? "failure" : "success";
  if (outcome === "success" && !xdrString(body.transactionData) && !Array.isArray(body.results)) {
    return fail("malformed_data", "A successful simulation needs transactionData or results.");
  }
  const minResourceFee = integerString(body.minResourceFee);
  const restoreMin = integerString(restore?.minResourceFee);
  if (minResourceFee === "bad" || restoreMin === "bad") {
    return fail("invalid_input", "A reported fee must be a non-negative integer string.");
  }
  return {
    ok: true,
    simulation: {
      outcome,
      transactionData: xdrString(body.transactionData),
      minResourceFee,
      restoreTransactionData: xdrString(restore?.transactionData),
      restoreMinResourceFee: restoreMin,
      failureMessage: errorText
    }
  };
}
