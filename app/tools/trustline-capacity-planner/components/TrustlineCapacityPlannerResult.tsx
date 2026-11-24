import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "@/app/tools/trustline-capacity-planner/copy";
import { AssetIdentityRow } from "@/app/tools/trustline-capacity-planner/components/AssetIdentityRow";
import { CapacityBreakdown } from "@/app/tools/trustline-capacity-planner/components/CapacityBreakdown";
import { AuthorizationStatus } from "@/app/tools/trustline-capacity-planner/components/AuthorizationStatus";
import type { TrustlineCapacityResult } from "@/app/tools/trustline-capacity-planner/types";

export function TrustlineCapacityPlannerResult({ result }: { result: TrustlineCapacityResult }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-extrabold text-[#172033]">{copy.resultTitle}</h2>
      <AssetIdentityRow
        accountId={result.accountId}
        assetCode={result.assetCode}
        issuerId={result.issuerId}
      />
      <CapacityBreakdown
        receivingCapacity={result.receivingCapacity}
        limit={result.limit}
        balance={result.balance}
        buyingLiabilities={result.buyingLiabilities}
        assetCode={result.assetCode}
      />
      <AuthorizationStatus authorization={result.authorization} />
      {result.liabilitiesIncomplete ? (
        <StatusMessage type="warning" title={copy.incompleteNoticeTitle} description={copy.incompleteNoticeBody} />
      ) : null}
    </div>
  );
}
