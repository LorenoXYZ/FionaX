"use client";

import { useRef, useState } from "react";
import { runSorobanStorageTtlInspector } from "@/app/tools/soroban-storage-ttl-inspector/lib/sorobanStorageTtlInspector";
import { toTtlError } from "@/app/tools/soroban-storage-ttl-inspector/lib/sorobanStorageTtlInspector.errors";
import { validateTtlInput } from "@/app/tools/soroban-storage-ttl-inspector/schema";
import type { TtlError, TtlResult } from "@/app/tools/soroban-storage-ttl-inspector/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: TtlResult }
  | { status: "error"; error: TtlError };

export function useSorobanStorageTtlInspector() {
  const [state, setState] = useState<State>({ status: "idle" });
  const requestId = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  function submit(raw: string) {
    const parsed = validateTtlInput(raw);
    if (!parsed.ok) {
      abortRef.current?.abort();
      requestId.current += 1;
      setState({ status: "error", error: parsed.error });
      return;
    }
    abortRef.current?.abort();
    requestId.current += 1;
    const id = requestId.current;
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "loading" });
    void runSorobanStorageTtlInspector(parsed.input, {}, controller.signal).then((result) => {
      if (id !== requestId.current) return;
      setState(result.ok ? { status: "success", result: result.result } : { status: "error", error: result.error });
    }).catch((error: unknown) => {
      if (id !== requestId.current) return;
      setState({ status: "error", error: toTtlError(error) });
    });
  }

  function reset() {
    abortRef.current?.abort();
    requestId.current += 1;
    setState({ status: "idle" });
  }

  return { state, submit, reset };
}
