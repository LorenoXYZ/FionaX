"use client";

import { useRef, useState } from "react";
import { validateSignerQuorumSimulatorInput } from "@/app/tools/signer-quorum-simulator/schema";
import { runSignerQuorumSimulator } from "@/app/tools/signer-quorum-simulator/lib/signerQuorumSimulator";
import { toToolError } from "@/app/tools/signer-quorum-simulator/lib/signerQuorumSimulator.errors";
import type {
  SignerQuorumSimulatorError,
  SignerQuorumSimulatorResult
} from "@/app/tools/signer-quorum-simulator/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: SignerQuorumSimulatorResult }
  | { status: "error"; error: SignerQuorumSimulatorError };

/**
 * Local-processing state machine. The simulation is synchronous, but the hook
 * keeps a `loading` phase so the UI stays consistent with async tools, and a
 * run token so an obsolete result is never applied after a newer submission.
 */
export function useSignerQuorumSimulator() {
  const [state, setState] = useState<State>({ status: "idle" });
  const runToken = useRef(0);

  function submit(rawAccountJson: string, rawSelection: string) {
    const parsed = validateSignerQuorumSimulatorInput(rawAccountJson, rawSelection);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }

    const token = ++runToken.current;
    setState({ status: "loading" });

    try {
      const result = runSignerQuorumSimulator(parsed.input);
      if (token === runToken.current) {
        setState({ status: "success", result });
      }
    } catch (error) {
      if (token === runToken.current) {
        setState({ status: "error", error: toToolError(error) });
      }
    }
  }

  function reset() {
    runToken.current += 1;
    setState({ status: "idle" });
  }

  return { state, submit, reset };
}
