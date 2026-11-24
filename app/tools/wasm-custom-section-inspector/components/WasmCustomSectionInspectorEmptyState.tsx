import { copy } from "@/app/tools/wasm-custom-section-inspector/copy";

export function WasmCustomSectionInspectorEmptyState() {
  return <p className="text-sm text-[#4e5c73]">{copy.empty}</p>;
}
