"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { SorobanResourceBudgetExplainerEmptyState } from "@/app/tools/soroban-resource-budget-explainer/components/SorobanResourceBudgetExplainerEmptyState";
import { SorobanResourceBudgetExplainerForm } from "@/app/tools/soroban-resource-budget-explainer/components/SorobanResourceBudgetExplainerForm";
import { SorobanResourceBudgetExplainerResult } from "@/app/tools/soroban-resource-budget-explainer/components/SorobanResourceBudgetExplainerResult";
import { copy } from "@/app/tools/soroban-resource-budget-explainer/copy";
import { useSorobanResourceBudgetExplainer } from "@/app/tools/soroban-resource-budget-explainer/hooks/useSorobanResourceBudgetExplainer";

export function SorobanResourceBudgetExplainerPanel() {
  const { state, submit, reset } = useSorobanResourceBudgetExplainer();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="trust" eyebrow={copy.eyebrow} title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <SorobanResourceBudgetExplainerForm onSubmit={submit} loading={state.status === "loading"} />
        {state.status === "idle" ? <SorobanResourceBudgetExplainerEmptyState /> : null}
        {state.status === "loading" ? <p className="text-sm text-[#68758a]">{copy.loading}</p> : null}
        {state.status === "error" ? <StatusMessage type="error" title={copy.errors[state.error.code]} description={state.error.message} /> : null}
        {state.status === "success" ? <SorobanResourceBudgetExplainerResult result={state.result} /> : null}
        {state.status !== "idle" ? <button type="button" onClick={reset} className="text-sm font-bold text-[#8a5a4c]">Clear</button> : null}
      </Card>
    </div>
  );
}
