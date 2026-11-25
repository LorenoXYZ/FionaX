"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { useSignerQuorumSimulator } from "@/app/tools/signer-quorum-simulator/hooks/useSignerQuorumSimulator";
import { copy } from "@/app/tools/signer-quorum-simulator/copy";
import { SignerQuorumSimulatorForm } from "@/app/tools/signer-quorum-simulator/components/SignerQuorumSimulatorForm";
import { SignerQuorumSimulatorResult } from "@/app/tools/signer-quorum-simulator/components/SignerQuorumSimulatorResult";
import { SignerQuorumSimulatorEmptyState } from "@/app/tools/signer-quorum-simulator/components/SignerQuorumSimulatorEmptyState";
import { StatusMessage } from "@/components/ui/StatusMessage";

export function SignerQuorumSimulatorPanel() {
  const { state, submit } = useSignerQuorumSimulator();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="trust" eyebrow={copy.eyebrow} title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <SignerQuorumSimulatorForm onSubmit={submit} loading={state.status === "loading"} />
        {state.status === "idle" ? <SignerQuorumSimulatorEmptyState /> : null}
        {state.status === "loading" ? <p className="text-sm text-[#68758a]">{copy.loading}</p> : null}
        {state.status === "error" ? (
          <StatusMessage type="error" title="Could not simulate that selection" description={copy.errors[state.error.code]} />
        ) : null}
        {state.status === "success" ? <SignerQuorumSimulatorResult result={state.result} /> : null}
      </Card>
    </div>
  );
}
