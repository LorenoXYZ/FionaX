"use client";
import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "../copy";
import { useOfferLiabilityInspector } from "../hooks/useOfferLiabilityInspector";
import { OfferLiabilityInspectorForm } from "./OfferLiabilityInspectorForm";
import { OfferLiabilityInspectorResult } from "./OfferLiabilityInspectorResult";
import { OfferLiabilityInspectorEmptyState } from "./OfferLiabilityInspectorEmptyState";
export function OfferLiabilityInspectorPanel() {
  const { state, submit } = useOfferLiabilityInspector();
  return <div className="mx-auto max-w-3xl space-y-6"><CharacterPanel tone="trust" eyebrow="Assets and trustlines" title={copy.title} description={copy.idle} /><Card className="space-y-5"><OfferLiabilityInspectorForm onSubmit={submit} busy={state.status === "loading" || state.status === "processing"} />{state.status === "idle" && <OfferLiabilityInspectorEmptyState />}{(state.status === "loading" || state.status === "processing") && <p role="status">{copy[state.status]}</p>}{state.status === "error" && <StatusMessage type="error" title="Inspection could not complete" description={copy.errors[state.code]} />}{state.status === "success" && <OfferLiabilityInspectorResult result={state.result} />}</Card></div>;
}
