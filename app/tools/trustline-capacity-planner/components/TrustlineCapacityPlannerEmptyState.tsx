import { copy } from "@/app/tools/trustline-capacity-planner/copy";

export function TrustlineCapacityPlannerEmptyState() {
  return <p className="text-sm text-[#68758a]">{copy.empty}</p>;
}
