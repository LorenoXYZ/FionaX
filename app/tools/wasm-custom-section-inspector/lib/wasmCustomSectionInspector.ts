import { coverSections } from "@/app/tools/wasm-custom-section-inspector/lib/section-coverage";
import { scanWasm } from "@/app/tools/wasm-custom-section-inspector/lib/wasm-section-scan";
import type { WasmError, WasmResult } from "@/app/tools/wasm-custom-section-inspector/types";

export function runWasmCustomSectionInspector(bytes: Uint8Array): { ok: true; result: WasmResult } | { ok: false; error: WasmError } {
  const scanned = scanWasm(bytes);
  if (!scanned.ok) return scanned;
  return { ok: true, result: coverSections(scanned.version, scanned.sections) };
}
