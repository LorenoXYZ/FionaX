"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { useTransactionEnvelopeDiff } from "@/app/tools/transaction-envelope-diff/hooks/useTransactionEnvelopeDiff";
import { copy } from "@/app/tools/transaction-envelope-diff/copy";
import { TransactionEnvelopeDiffForm } from "@/app/tools/transaction-envelope-diff/components/TransactionEnvelopeDiffForm";
import { TransactionEnvelopeDiffResult } from "@/app/tools/transaction-envelope-diff/components/TransactionEnvelopeDiffResult";
import { TransactionEnvelopeDiffEmptyState } from "@/app/tools/transaction-envelope-diff/components/TransactionEnvelopeDiffEmptyState";
import { StatusMessage } from "@/components/ui/StatusMessage";

export function TransactionEnvelopeDiffPanel() {
  const { state, submit } = useTransactionEnvelopeDiff();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="trust" eyebrow={copy.eyebrow} title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <TransactionEnvelopeDiffForm onSubmit={submit} loading={state.status === "loading"} />
        {state.status === "idle" ? <TransactionEnvelopeDiffEmptyState /> : null}
        {state.status === "loading" ? <p className="text-sm text-[#68758a]">{copy.loading}</p> : null}
        {state.status === "error" ? (
          <StatusMessage type="error" title="Could not compare those envelopes" description={copy.errors[state.error.code]} />
        ) : null}
        {state.status === "success" ? <TransactionEnvelopeDiffResult result={state.result} /> : null}
      </Card>
    </div>
  );
}
