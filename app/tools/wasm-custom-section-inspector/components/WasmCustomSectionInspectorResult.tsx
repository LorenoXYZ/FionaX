import { MissingSectionNotice } from "@/app/tools/wasm-custom-section-inspector/components/MissingSectionNotice";
import { SorobanMetadataRows } from "@/app/tools/wasm-custom-section-inspector/components/SorobanMetadataRows";
import { WasmSectionRows } from "@/app/tools/wasm-custom-section-inspector/components/WasmSectionRows";
import { copy } from "@/app/tools/wasm-custom-section-inspector/copy";
import type { WasmResult } from "@/app/tools/wasm-custom-section-inspector/types";

export function WasmCustomSectionInspectorResult({ result }: { result: WasmResult }) {
  return (
    <section aria-label={copy.resultTitle} className="space-y-3">
      <h2 className="text-lg font-bold text-[#172033]">{copy.resultTitle}</h2>
      <p className="text-sm text-[#4e5c73]">Wasm version {result.version}</p>
      <MissingSectionNotice result={result} />
      <WasmSectionRows sections={result.sections} />
      <SorobanMetadataRows result={result} />
    </section>
  );
}
