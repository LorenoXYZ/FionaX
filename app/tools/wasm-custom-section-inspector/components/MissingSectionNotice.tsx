import { formatStatus } from "@/app/tools/wasm-custom-section-inspector/lib/format";
import type { WasmResult } from "@/app/tools/wasm-custom-section-inspector/types";

export function MissingSectionNotice({ result }: { result: WasmResult }) {
  return (
    <ul className="text-sm text-[#4e5c73]">
      <li>Environment: {formatStatus(result.environment.status)}</li>
      <li>Spec: {formatStatus(result.spec.status)}</li>
      <li>Publisher: {formatStatus(result.publisher.status)}</li>
    </ul>
  );
}
