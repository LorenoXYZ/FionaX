import { copy } from "@/app/tools/signer-quorum-simulator/copy";
import { ThresholdVerdicts } from "@/app/tools/signer-quorum-simulator/components/ThresholdVerdicts";
import { WeightContributionRows } from "@/app/tools/signer-quorum-simulator/components/WeightContributionRows";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { SignerQuorumSimulatorResult as Result } from "@/app/tools/signer-quorum-simulator/types";

export function SignerQuorumSimulatorResult({ result }: { result: Result }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-extrabold text-[#172033]">{copy.resultTitle}</h2>
      <ThresholdVerdicts verdicts={result.verdicts} />
      <WeightContributionRows contributions={result.contributions} />
      {result.unresolved.length > 0 ? (
        <StatusMessage
          type="warning"
          title={copy.unresolvedTitle}
          description={`${result.unresolved.map((u) => u.key).join(", ")} — ${copy.unresolvedBody}`}
        />
      ) : null}
      {result.evidenceIncomplete ? (
        <StatusMessage type="info" title="Incomplete evidence" description={copy.incompleteNotice} />
      ) : null}
    </div>
  );
}
