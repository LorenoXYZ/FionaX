import type { BudgetError } from "@/app/tools/soroban-resource-budget-explainer/types";

export function toBudgetError(error: unknown): BudgetError {
  if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
    const code = (error as { code?: unknown }).code;
    if (code === "invalid_input" || code === "malformed_data" || code === "unsupported_variant" || code === "too_large") {
      return error as BudgetError;
    }
  }
  return { code: "malformed_data", message: "The simulation could not be explained." };
}
