"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { useTrustlineCapacityPlanner } from "@/app/tools/trustline-capacity-planner/hooks/useTrustlineCapacityPlanner";
import { copy } from "@/app/tools/trustline-capacity-planner/copy";
import { TrustlineCapacityPlannerForm } from "@/app/tools/trustline-capacity-planner/components/TrustlineCapacityPlannerForm";
import { TrustlineCapacityPlannerResult } from "@/app/tools/trustline-capacity-planner/components/TrustlineCapacityPlannerResult";
import { TrustlineCapacityPlannerEmptyState } from "@/app/tools/trustline-capacity-planner/components/TrustlineCapacityPlannerEmptyState";
import { StatusMessage } from "@/components/ui/StatusMessage";

export function TrustlineCapacityPlannerPanel() {
  const { state, submit, reset } = useTrustlineCapacityPlanner();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="trust" eyebrow={copy.eyebrow} title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <TrustlineCapacityPlannerForm onSubmit={submit} loading={state.status === "loading"} />
        {state.status === "idle" ? <TrustlineCapacityPlannerEmptyState /> : null}
        {state.status === "error" ? (
          <StatusMessage type="error" title="Could not plan this trustline" description={copy.errors[state.error.code]} />
        ) : null}
        {state.status === "success" ? (
          <>
            <TrustlineCapacityPlannerResult result={state.result} />
            <button
              type="button"
              onClick={reset}
              className="text-sm font-bold text-[#8a5a4c] hover:underline"
            >
              Clear and start over
            </button>
          </>
        ) : null}
      </Card>
    </div>
  );
}
