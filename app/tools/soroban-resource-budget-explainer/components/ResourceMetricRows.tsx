import { formatMetric } from "@/app/tools/soroban-resource-budget-explainer/lib/format";
import type { MetricEvidence } from "@/app/tools/soroban-resource-budget-explainer/types";

export function ResourceMetricRows({ metrics }: { metrics: MetricEvidence[] }) {
  return (
    <ul className="space-y-1">
      {metrics.map((metric) => (
        <li key={metric.name} className="text-sm text-[#172033]">
          <span className="font-bold">{metric.name}</span>: {formatMetric(metric.value, metric.unit)}
        </li>
      ))}
    </ul>
  );
}
