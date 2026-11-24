import { copy } from "@/app/tools/soroban-resource-budget-explainer/copy";

export function SorobanResourceBudgetExplainerEmptyState() {
  return <p className="text-sm text-[#4e5c73]">{copy.empty}</p>;
}
