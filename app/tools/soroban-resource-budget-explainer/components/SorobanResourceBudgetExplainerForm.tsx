"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { copy } from "@/app/tools/soroban-resource-budget-explainer/copy";

export function SorobanResourceBudgetExplainerForm({
  onSubmit,
  loading
}: {
  onSubmit: (value: { simulationJson: string; envelopeXdr: string }) => void;
  loading: boolean;
}) {
  const [simulationJson, setSimulationJson] = useState("");
  const [envelopeXdr, setEnvelopeXdr] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ simulationJson, envelopeXdr });
      }}
    >
      <label htmlFor="budget-simulation" className="text-sm font-bold text-[#4e5c73]">{copy.simulationLabel}</label>
      <textarea id="budget-simulation" value={simulationJson} onChange={(event) => setSimulationJson(event.target.value)} rows={8} spellCheck={false} className="w-full rounded-md border border-[#c7d6e8] bg-white/78 px-4 py-3 font-mono text-sm" />
      <label htmlFor="budget-envelope" className="text-sm font-bold text-[#4e5c73]">{copy.envelopeLabel}</label>
      <textarea id="budget-envelope" value={envelopeXdr} onChange={(event) => setEnvelopeXdr(event.target.value)} rows={3} spellCheck={false} className="w-full rounded-md border border-[#c7d6e8] bg-white/78 px-4 py-3 font-mono text-sm" />
      <Button type="submit" disabled={loading}>{loading ? copy.loading : copy.submit}</Button>
    </form>
  );
}
