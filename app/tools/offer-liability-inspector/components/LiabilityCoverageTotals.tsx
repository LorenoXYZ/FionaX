import type { LiabilityGroup } from "../types";
import { formatAmount } from "../lib/format";
export function LiabilityCoverageTotals({ groups }: { groups: LiabilityGroup[] }) {
  return <section className="space-y-2"><h3 className="font-bold">Asset liability totals</h3><ul className="space-y-3">{groups.map(group => <li key={group.asset.key} className="break-all rounded border p-2 text-sm"><strong>{group.asset.label}</strong> — {group.status}<div>Balance: {group.balance === undefined ? "unavailable" : formatAmount(group.balance)}</div><div>Selling: offers {formatAmount(group.expectedSelling)} / account {group.declaredSelling === undefined ? "unavailable" : formatAmount(group.declaredSelling)}</div><div>Buying: offers {formatAmount(group.expectedBuying)} / account {group.declaredBuying === undefined ? "unavailable" : formatAmount(group.declaredBuying)}</div></li>)}</ul></section>;
}
