"use client";
import { useEffect, useRef, useState } from "react";
import { useNetwork } from "@/components/stellar/NetworkProvider";
import { validateInput } from "../schema";
import { runInspector } from "../lib/offerLiabilityInspector";
import { errorCode } from "../lib/offerLiabilityInspector.errors";
import type { InspectorCode, InspectorResult } from "../types";
type State = { status: "idle" } | { status: "loading" | "processing" } | { status: "success"; result: InspectorResult } | { status: "error"; code: InspectorCode };
export function useOfferLiabilityInspector() {
  const { network } = useNetwork();
  const [state, setState] = useState<State>({ status: "idle" });
  const controller = useRef<AbortController | null>(null);
  const generation = useRef(0);
  useEffect(() => { controller.current?.abort(); generation.current++; return () => { controller.current?.abort(); }; }, [network]);
  async function submit(raw: string) {
    controller.current?.abort(); const token = ++generation.current;
    let input;
    try { input = validateInput(raw, network); } catch (error) { setState({ status: "error", code: errorCode(error) }); return; }
    const request = new AbortController(); controller.current = request;
    setState({ status: "loading" });
    try {
      const result = await runInspector(input, undefined, request.signal);
      if (token === generation.current && !request.signal.aborted) { setState({ status: "processing" }); queueMicrotask(() => { if (token === generation.current && !request.signal.aborted) setState({ status: "success", result }); }); }
    } catch (error) { if (token === generation.current && !request.signal.aborted) setState({ status: "error", code: errorCode(error) }); }
  }
  return { state: state.status === "success" && state.result.network !== network ? { status: "idle" } as State : state, submit };
}
