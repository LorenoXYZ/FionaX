import type { WasmError } from "@/app/tools/wasm-custom-section-inspector/types";

export function toWasmError(error: unknown): WasmError {
  if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
    const code = (error as { code?: unknown }).code;
    if (code === "invalid_input" || code === "malformed_data" || code === "unsupported_variant" || code === "too_large") {
      return error as WasmError;
    }
  }
  return { code: "malformed_data", message: "The Wasm module could not be inspected." };
}
