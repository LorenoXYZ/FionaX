"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { useSequenceInspector } from "@/app/tools/sequence-inspector/hooks/useSequenceInspector";
import { copy } from "@/app/tools/sequence-inspector/copy";
import { SequenceInspectorForm } from "@/app/tools/sequence-inspector/components/SequenceInspectorForm";
import { SequenceInspectorResult } from "@/app/tools/sequence-inspector/components/SequenceInspectorResult";
import { SequenceInspectorEmptyState } from "@/app/tools/sequence-inspector/components/SequenceInspectorEmptyState";
import { StatusMessage } from "@/components/ui/StatusMessage";

export function SequenceInspectorPanel() {
  const { state, submit } = useSequenceInspector();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="trust" eyebrow={copy.eyebrow} title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <SequenceInspectorForm onSubmit={submit} loading={state.status === "loading"} />
        {state.status === "idle" ? <SequenceInspectorEmptyState /> : null}
        {state.status === "loading" ? <p className="text-sm text-[#68758a]">{copy.loading}</p> : null}
        {state.status === "error" ? (
          <StatusMessage type="error" title="Could not read that account" description={copy.errors[state.error.code]} />
        ) : null}
        {state.status === "success" ? <SequenceInspectorResult result={state.result} /> : null}
      </Card>
    </div>
  );
}
