"use client";

import { useState } from "react";
import { validateTrustlineCapacityInput } from "@/app/tools/trustline-capacity-planner/schema";
import { runTrustlineCapacityPlanner } from "@/app/tools/trustline-capacity-planner/lib/trustlineCapacityPlanner";
import { toToolError } from "@/app/tools/trustline-capacity-planner/lib/trustlineCapacityPlanner.errors";
import type {
  TrustlineCapacityError,
  TrustlineCapacityResult
} from "@/app/tools/trustline-capacity-planner/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: TrustlineCapacityResult }
  | { status: "error"; error: TrustlineCapacityError };

export interface SubmitFields {
  accountId: string;
  assetCode: string;
  issuerId: string;
  rawRecord: string;
}

export function useTrustlineCapacityPlanner() {
  const [state, setState] = useState<State>({ status: "idle" });

  function submit(fields: SubmitFields) {
    const parsed = validateTrustlineCapacityInput(
      fields.accountId,
      fields.assetCode,
      fields.issuerId,
      fields.rawRecord
    );
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }

    setState({ status: "loading" });
    try {
      const outcome = runTrustlineCapacityPlanner(parsed.input);
      if (!outcome.ok) {
        setState({ status: "error", error: outcome.error });
        return;
      }
      setState({ status: "success", result: outcome.result });
    } catch (error) {
      setState({ status: "error", error: toToolError(error) });
    }
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { state, submit, reset };
}
