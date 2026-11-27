"use client";
import { useRef, useState } from "react";
import { inspectFeeBump } from "../lib/feeBumpEnvelopeInspector";
import { toInspectorError } from "../lib/feeBumpEnvelopeInspector.errors";
import type { InspectorError, InspectorResult } from "../types";
export type InspectorState = { status: "idle" } | { status: "loading" } | { status: "error"; error: InspectorError } | { status: "success"; result: InspectorResult };
export function useFeeBumpEnvelopeInspector() {
  const [state, setState] = useState<InspectorState>({ status: "idle" });
  const generation = useRef(0);
  function reset() { generation.current++; setState({ status: "idle" }); }
  function submit(envelope: string, passphrase: string) {
    const current = ++generation.current;
    setState({ status: "loading" });
    queueMicrotask(() => {
      if (current !== generation.current) return;
      try { const result = inspectFeeBump({ envelope, passphrase }); if (current === generation.current) setState({ status: "success", result }); }
      catch (error) { if (current === generation.current) setState({ status: "error", error: toInspectorError(error) }); }
    });
  }
  return { state, submit, reset };
}
