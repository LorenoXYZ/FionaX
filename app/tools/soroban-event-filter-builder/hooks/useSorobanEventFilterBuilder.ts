"use client";

import { useRef, useState } from "react";
import { runSorobanEventFilterBuilder } from "@/app/tools/soroban-event-filter-builder/lib/sorobanEventFilterBuilder";
import { validateEventFilterInput } from "@/app/tools/soroban-event-filter-builder/schema";
import type { EventFilterError, EventFilterResult } from "@/app/tools/soroban-event-filter-builder/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: EventFilterResult }
  | { status: "error"; error: EventFilterError };

export function useSorobanEventFilterBuilder() {
  const [state, setState] = useState<State>({ status: "idle" });
  const requestId = useRef(0);

  function submit(raw: string) {
    const parsed = validateEventFilterInput(raw);
    if (!parsed.ok) {
      requestId.current += 1;
      setState({ status: "error", error: parsed.error });
      return;
    }
    requestId.current += 1;
    const id = requestId.current;
    setState({ status: "loading" });
    const result = runSorobanEventFilterBuilder(parsed.input);
    if (id !== requestId.current) return;
    setState(result.ok ? { status: "success", result: result.result } : { status: "error", error: result.error });
  }

  function reset() {
    requestId.current += 1;
    setState({ status: "idle" });
  }

  return { state, submit, reset };
}
