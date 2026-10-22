import { copy } from "@/app/tools/sequence-inspector/copy";
import { SequenceSummary } from "@/app/tools/sequence-inspector/components/SequenceSummary";
import { NextSequenceNotice } from "@/app/tools/sequence-inspector/components/NextSequenceNotice";
import { PendingTransactionWarning } from "@/app/tools/sequence-inspector/components/PendingTransactionWarning";
import { RawSequenceValue } from "@/app/tools/sequence-inspector/components/RawSequenceValue";
import type { SequenceInspectorResult as Result } from "@/app/tools/sequence-inspector/types";

export function SequenceInspectorResult({ result }: { result: Result }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-extrabold text-[#172033]">{copy.resultTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <SequenceSummary currentSequence={result.currentSequence} />
        <NextSequenceNotice nextSequence={result.nextSequence} />
      </div>
      <PendingTransactionWarning />
      <RawSequenceValue value={result.currentSequence} />
    </div>
  );
}
