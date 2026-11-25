"use client";
import { useRef, useState } from "react";
import { validateTradePriceRationalInspectorInput } from "@/app/tools/trade-price-rational-inspector/schema";
import { runTradePriceRationalInspector } from "@/app/tools/trade-price-rational-inspector/lib/tradePriceRationalInspector";
import { toToolError } from "@/app/tools/trade-price-rational-inspector/lib/tradePriceRationalInspector.errors";
import type { InspectorError, InspectorResult } from "@/app/tools/trade-price-rational-inspector/types";
type State = { status: "idle" } | { status: "loading" } | { status: "success"; result: InspectorResult } | { status: "error"; error: InspectorError };
export function useTradePriceRationalInspector() {
  const [state, setState] = useState<State>({ status: "idle" });
  const generation = useRef(0);
  function reset() { generation.current++; setState({ status: "idle" }); }
  async function submit(raw: string) {
    const current = ++generation.current;
    const validated = validateTradePriceRationalInspectorInput(raw);
    if (!validated.ok) { setState({ status: "error", error: validated.error }); return; }
    setState({ status: "loading" });
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    if (current !== generation.current) return;
    try {
      const result = runTradePriceRationalInspector(validated.input);
      if (current === generation.current) setState({ status: "success", result });
    } catch (error) {
      if (current === generation.current) setState({ status: "error", error: toToolError(error) });
    }
  }
  return { state, submit, reset };
}
