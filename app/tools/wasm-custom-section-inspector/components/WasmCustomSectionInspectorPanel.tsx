"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { WasmCustomSectionInspectorEmptyState } from "@/app/tools/wasm-custom-section-inspector/components/WasmCustomSectionInspectorEmptyState";
import { WasmCustomSectionInspectorForm } from "@/app/tools/wasm-custom-section-inspector/components/WasmCustomSectionInspectorForm";
import { WasmCustomSectionInspectorResult } from "@/app/tools/wasm-custom-section-inspector/components/WasmCustomSectionInspectorResult";
import { copy } from "@/app/tools/wasm-custom-section-inspector/copy";
import { useWasmCustomSectionInspector } from "@/app/tools/wasm-custom-section-inspector/hooks/useWasmCustomSectionInspector";

export function WasmCustomSectionInspectorPanel() {
  const { state, submit, reset } = useWasmCustomSectionInspector();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="detective" eyebrow={copy.eyebrow} title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <WasmCustomSectionInspectorForm onSubmit={submit} loading={state.status === "loading"} />
        {state.status === "idle" ? <WasmCustomSectionInspectorEmptyState /> : null}
        {state.status === "loading" ? <p className="text-sm text-[#68758a]">{copy.loading}</p> : null}
        {state.status === "error" ? <StatusMessage type="error" title={copy.errors[state.error.code]} description={state.error.message} /> : null}
        {state.status === "success" ? <WasmCustomSectionInspectorResult result={state.result} /> : null}
        {state.status !== "idle" ? <button type="button" onClick={reset} className="text-sm font-bold text-[#8a5a4c]">Clear</button> : null}
      </Card>
    </div>
  );
}
