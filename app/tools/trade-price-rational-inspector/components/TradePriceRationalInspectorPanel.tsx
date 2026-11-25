"use client";
import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "@/app/tools/trade-price-rational-inspector/copy";
import { useTradePriceRationalInspector } from "@/app/tools/trade-price-rational-inspector/hooks/useTradePriceRationalInspector";
import { TradePriceRationalInspectorForm } from "@/app/tools/trade-price-rational-inspector/components/TradePriceRationalInspectorForm";
import { TradePriceRationalInspectorEmptyState } from "@/app/tools/trade-price-rational-inspector/components/TradePriceRationalInspectorEmptyState";
import { TradePriceRationalInspectorResult } from "@/app/tools/trade-price-rational-inspector/components/TradePriceRationalInspectorResult";
export function TradePriceRationalInspectorPanel() {
  const { state, submit, reset } = useTradePriceRationalInspector();
  return <div className="mx-auto max-w-4xl space-y-6">
    <CharacterPanel tone="trust" eyebrow="Assets & Trustlines" title={copy.title} description={copy.idle} />
    <Card className="space-y-5">
      <TradePriceRationalInspectorForm onSubmit={submit} onReset={reset} loading={state.status === "loading"} error={state.status === "error" ? copy.errors[state.error.code] : undefined} />
      {state.status === "idle" && <TradePriceRationalInspectorEmptyState />}
      {state.status === "loading" && <p role="status" aria-live="polite" className="text-sm">{copy.loading}</p>}
      {state.status === "error" && <StatusMessage type="error" title="Cannot inspect this input" description={state.error.message} />}
      {state.status === "success" && <TradePriceRationalInspectorResult result={state.result} />}
    </Card>
  </div>;
}
