"use client";

import { useState } from "react";
import { validateSequenceInspectorInput } from "@/app/tools/sequence-inspector/schema";
import { runSequenceInspector } from "@/app/tools/sequence-inspector/lib/sequenceInspector";
import { toToolError } from "@/app/tools/sequence-inspector/lib/sequenceInspector.errors";
import type { SequenceInspectorError, SequenceInspectorResult } from "@/app/tools/sequence-inspector/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: SequenceInspectorResult }
  | { status: "error"; error: SequenceInspectorError };

export function useSequenceInspector() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function submit(raw: string) {
    const parsed = validateSequenceInspectorInput(raw);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }
    setState({ status: "loading" });
    try {
      const result = await runSequenceInspector(parsed.input);
      setState({ status: "success", result });
    } catch (error) {
      setState({ status: "error", error: toToolError(error) });
    }
  }

  return { state, submit };
}
