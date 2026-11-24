import { formatCapacity } from "@/app/tools/trustline-capacity-planner/lib/format";
import { copy } from "@/app/tools/trustline-capacity-planner/copy";

interface Props {
  receivingCapacity: string;
  limit: string;
  balance: string;
  buyingLiabilities: string;
  assetCode: string;
}

/**
 * Shows the receiving-headroom number and the three formula inputs beneath it,
 * so a reader can reproduce `limit − balance − buying liabilities` themselves.
 */
export function CapacityBreakdown({
  receivingCapacity,
  limit,
  balance,
  buyingLiabilities,
  assetCode
}: Props) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[#70c7a7]/60 bg-[#e1f8ef] p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[#17664b]">{copy.capacityLabel}</p>
        <p className="mt-1 break-all font-mono text-xl font-extrabold text-[#17664b]">
          {formatCapacity(receivingCapacity, assetCode)}
        </p>
        <p className="mt-1 text-xs text-[#4e5c73]">{copy.capacityHelp}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[#cfe0ea] bg-white/70 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#68758a]">{copy.limitLabel}</p>
          <p className="mt-1 break-all font-mono text-sm font-bold text-[#172033]">{limit}</p>
        </div>
        <div className="rounded-lg border border-[#cfe0ea] bg-white/70 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#68758a]">{copy.balanceLabel}</p>
          <p className="mt-1 break-all font-mono text-sm font-bold text-[#172033]">{balance}</p>
        </div>
        <div className="rounded-lg border border-[#cfe0ea] bg-white/70 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#68758a]">{copy.buyingLiabilitiesLabel}</p>
          <p className="mt-1 break-all font-mono text-sm font-bold text-[#172033]">{buyingLiabilities}</p>
        </div>
      </div>
    </div>
  );
}
