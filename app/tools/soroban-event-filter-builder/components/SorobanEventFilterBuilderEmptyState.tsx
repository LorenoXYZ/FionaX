import { copy } from "@/app/tools/soroban-event-filter-builder/copy";

export function SorobanEventFilterBuilderEmptyState() {
  return <p className="text-sm text-[#4e5c73]">{copy.empty}</p>;
}
