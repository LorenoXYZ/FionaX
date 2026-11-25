import { copy } from "@/app/tools/transaction-envelope-diff/copy";
import { TransactionFieldDiff } from "@/app/tools/transaction-envelope-diff/components/TransactionFieldDiff";
import { OperationDiffRows } from "@/app/tools/transaction-envelope-diff/components/OperationDiffRows";
import { SignatureDiffRows } from "@/app/tools/transaction-envelope-diff/components/SignatureDiffRows";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { TransactionEnvelopeDiffResult as Result } from "@/app/tools/transaction-envelope-diff/types";

export function TransactionEnvelopeDiffResult({ result }: { result: Result }) {
  if (result.identical) {
    return (
      <StatusMessage type="success" title={copy.identicalTitle} description={copy.identicalBody} />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-extrabold text-[#172033]">{copy.resultTitle}</h2>
      <TransactionFieldDiff fieldDiffs={result.fieldDiffs} />
      <OperationDiffRows operationDiffs={result.operationDiffs} />
      <SignatureDiffRows signatureDiffs={result.signatureDiffs} />
      {result.feeBumpOnlyChange ? (
        <StatusMessage type="info" title="Fee-bump only" description={copy.feeBumpOnlyBody} />
      ) : null}
    </div>
  );
}
