"use client";

import { useRef, useState } from "react";
import { runSorobanResourceBudgetExplainer } from "@/app/tools/soroban-resource-budget-explainer/lib/sorobanResourceBudgetExplainer";
import { validateBudgetInput } from "@/app/tools/soroban-resource-budget-explainer/schema";
import type { BudgetError, BudgetResult } from "@/app/tools/soroban-resource-budget-explainer/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: BudgetResult }
  | { status: "error"; error: BudgetError };

export function useSorobanResourceBudgetExplainer() {
  const [state, setState] = useState<State>({ status: "idle" });
  const requestId = useRef(0);

  function submit(raw: { simulationJson: string; envelopeXdr: string }) {
    const parsed = validateBudgetInput(raw);
    if (!parsed.ok) {
      requestId.current += 1;
      setState({ status: "error", error: parsed.error });
      return;
    }
    requestId.current += 1;
    const id = requestId.current;
    setState({ status: "loading" });
    const result = runSorobanResourceBudgetExplainer(parsed.input);
    if (id !== requestId.current) return;
    setState(result.ok ? { status: "success", result: result.result } : { status: "error", error: result.error });
  }

  function reset() {
    requestId.current += 1;
    setState({ status: "idle" });
  }

  return { state, submit, reset };
}
