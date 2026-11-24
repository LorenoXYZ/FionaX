import { FootprintKeyRows } from "@/app/tools/soroban-resource-budget-explainer/components/FootprintKeyRows";
import { ResourceFeeSummary } from "@/app/tools/soroban-resource-budget-explainer/components/ResourceFeeSummary";
import { ResourceMetricRows } from "@/app/tools/soroban-resource-budget-explainer/components/ResourceMetricRows";
import { copy } from "@/app/tools/soroban-resource-budget-explainer/copy";
import type { BudgetResult } from "@/app/tools/soroban-resource-budget-explainer/types";

export function SorobanResourceBudgetExplainerResult({ result }: { result: BudgetResult }) {
  return (
    <section aria-label={copy.resultTitle} className="space-y-3">
      <h2 className="text-lg font-bold text-[#172033]">{copy.resultTitle}</h2>
      <p className="text-sm font-bold text-[#4e5c73]">Outcome: {result.outcome}</p>
      {result.failureMessage ? <p className="text-sm text-[#9f342d]">{result.failureMessage}</p> : null}
      {result.completeness === "incomplete" ? <p role="status" className="text-sm text-[#9a513f]">Missing: {result.missing.join(", ")}</p> : null}
      <ResourceMetricRows metrics={result.metrics} />
      <ResourceFeeSummary fees={result.fees} />
      <FootprintKeyRows footprint={result.footprint} />
    </section>
  );
}
