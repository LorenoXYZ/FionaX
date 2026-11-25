import type { LiabilityGroup } from "../types";
export function compareCoverage(groups: LiabilityGroup[], truncated: boolean): LiabilityGroup[] {
  return groups.map(group => ({ ...group, status: truncated || group.balance === undefined || group.declaredSelling === undefined || group.declaredBuying === undefined ? "incomplete" : group.expectedSelling === group.declaredSelling && group.expectedBuying === group.declaredBuying ? "covered" : "mismatch" }));
}
