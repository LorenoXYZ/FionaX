"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { SorobanEventFilterBuilderEmptyState } from "@/app/tools/soroban-event-filter-builder/components/SorobanEventFilterBuilderEmptyState";
import { SorobanEventFilterBuilderForm } from "@/app/tools/soroban-event-filter-builder/components/SorobanEventFilterBuilderForm";
import { SorobanEventFilterBuilderResult } from "@/app/tools/soroban-event-filter-builder/components/SorobanEventFilterBuilderResult";
import { copy } from "@/app/tools/soroban-event-filter-builder/copy";
import { useSorobanEventFilterBuilder } from "@/app/tools/soroban-event-filter-builder/hooks/useSorobanEventFilterBuilder";

export function SorobanEventFilterBuilderPanel() {
  const { state, submit, reset } = useSorobanEventFilterBuilder();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="detective" eyebrow={copy.eyebrow} title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <SorobanEventFilterBuilderForm key={state.status === "idle" ? "edit" : state.status} onSubmit={submit} loading={state.status === "loading"} />
        {state.status === "idle" ? <SorobanEventFilterBuilderEmptyState /> : null}
        {state.status === "loading" ? <p className="text-sm text-[#68758a]">{copy.loading}</p> : null}
        {state.status === "error" ? (
          <StatusMessage type="error" title={copy.errors[state.error.code]} description={state.error.message} />
        ) : null}
        {state.status === "success" ? <SorobanEventFilterBuilderResult result={state.result} /> : null}
        {state.status !== "idle" ? (
          <button type="button" onClick={reset} className="text-sm font-bold text-[#8a5a4c]">
            Clear
          </button>
        ) : null}
      </Card>
    </div>
  );
}
