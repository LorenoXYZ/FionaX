"use client";

import { useRef, useState } from "react";
import { runWasmCustomSectionInspector } from "@/app/tools/wasm-custom-section-inspector/lib/wasmCustomSectionInspector";
import { validateWasmInput } from "@/app/tools/wasm-custom-section-inspector/schema";
import type { WasmError, WasmResult } from "@/app/tools/wasm-custom-section-inspector/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: WasmResult }
  | { status: "error"; error: WasmError };

export function useWasmCustomSectionInspector() {
  const [state, setState] = useState<State>({ status: "idle" });
  const requestId = useRef(0);

  function submit(raw: string) {
    const parsed = validateWasmInput(raw);
    if (!parsed.ok) {
      requestId.current += 1;
      setState({ status: "error", error: parsed.error });
      return;
    }
    requestId.current += 1;
    const id = requestId.current;
    setState({ status: "loading" });
    const result = runWasmCustomSectionInspector(parsed.bytes);
    if (id !== requestId.current) return;
    setState(result.ok ? { status: "success", result: result.result } : { status: "error", error: result.error });
  }

  function reset() {
    requestId.current += 1;
    setState({ status: "idle" });
  }

  return { state, submit, reset };
}
