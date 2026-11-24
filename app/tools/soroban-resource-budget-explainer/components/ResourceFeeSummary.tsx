import { formatFee } from "@/app/tools/soroban-resource-budget-explainer/lib/format";
import type { FeeEvidence } from "@/app/tools/soroban-resource-budget-explainer/types";

export function ResourceFeeSummary({ fees }: { fees: FeeEvidence[] }) {
  return (
    <ul className="space-y-1">
      {fees.map((fee) => (
        <li key={fee.name} className="font-mono text-sm text-[#172033]">
          {fee.name}: {formatFee(fee.value)}
        </li>
      ))}
    </ul>
  );
}
