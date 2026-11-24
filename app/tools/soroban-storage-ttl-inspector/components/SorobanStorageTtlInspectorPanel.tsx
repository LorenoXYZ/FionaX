"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { SorobanStorageTtlInspectorEmptyState } from "@/app/tools/soroban-storage-ttl-inspector/components/SorobanStorageTtlInspectorEmptyState";
import { SorobanStorageTtlInspectorForm } from "@/app/tools/soroban-storage-ttl-inspector/components/SorobanStorageTtlInspectorForm";
import { SorobanStorageTtlInspectorResult } from "@/app/tools/soroban-storage-ttl-inspector/components/SorobanStorageTtlInspectorResult";
import { copy } from "@/app/tools/soroban-storage-ttl-inspector/copy";
import { useSorobanStorageTtlInspector } from "@/app/tools/soroban-storage-ttl-inspector/hooks/useSorobanStorageTtlInspector";

export function SorobanStorageTtlInspectorPanel() {
  const { state, submit, reset } = useSorobanStorageTtlInspector();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="moon" eyebrow={copy.eyebrow} title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <SorobanStorageTtlInspectorForm onSubmit={submit} loading={state.status === "loading"} />
        {state.status === "idle" ? <SorobanStorageTtlInspectorEmptyState /> : null}
        {state.status === "loading" ? <p className="text-sm text-[#68758a]">{copy.loading}</p> : null}
        {state.status === "error" ? <StatusMessage type="error" title={copy.errors[state.error.code]} description={state.error.message} /> : null}
        {state.status === "success" ? <SorobanStorageTtlInspectorResult result={state.result} /> : null}
        {state.status !== "idle" ? <button type="button" onClick={reset} className="text-sm font-bold text-[#8a5a4c]">Clear</button> : null}
      </Card>
    </div>
  );
}
