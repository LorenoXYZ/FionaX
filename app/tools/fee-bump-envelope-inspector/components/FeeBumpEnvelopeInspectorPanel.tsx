"use client";
import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";
import { useFeeBumpEnvelopeInspector } from "../hooks/useFeeBumpEnvelopeInspector";
import { FeeBumpEnvelopeInspectorForm } from "./FeeBumpEnvelopeInspectorForm";
import { FeeBumpEnvelopeInspectorResult } from "./FeeBumpEnvelopeInspectorResult";
import { FeeBumpEnvelopeInspectorEmptyState } from "./FeeBumpEnvelopeInspectorEmptyState";
export function FeeBumpEnvelopeInspectorPanel() {
  const { state, submit, reset } = useFeeBumpEnvelopeInspector();
  return <div className="mx-auto max-w-3xl space-y-6">
    <CharacterPanel tone="trust" eyebrow="Transactions" title={copy.title} description={copy.intro} />
    <Card className="space-y-5">
      <FeeBumpEnvelopeInspectorForm onSubmit={submit} onReset={reset} loading={state.status === "loading"} />
      <div aria-live="polite">
        {state.status === "idle" && <FeeBumpEnvelopeInspectorEmptyState />}
        {state.status === "loading" && <p role="status">{copy.loading}</p>}
        {state.status === "error" && <StatusMessage type="error" title="Could not inspect envelope" description={state.error.message} />}
        {state.status === "success" && <FeeBumpEnvelopeInspectorResult result={state.result} />}
      </div>
    </Card>
  </div>;
}
