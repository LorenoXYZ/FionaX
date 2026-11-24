import type { WasmResult } from "@/app/tools/wasm-custom-section-inspector/types";

export function SorobanMetadataRows({ result }: { result: WasmResult }) {
  return (
    <div className="space-y-2 text-sm text-[#172033]">
      <p>Environment protocol {result.environment.protocol ?? "not declared"}</p>
      {result.spec.functions.map((fn) => <p key={fn.name}>Function {fn.name}</p>)}
      {result.spec.errors.map((error) => <p key={error.name}>Error {error.name}</p>)}
      {result.publisher.entries.map((entry) => <p key={`${entry.key}:${entry.value}`}>{entry.key} = {entry.value}</p>)}
    </div>
  );
}
