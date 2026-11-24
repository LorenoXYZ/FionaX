import { copy } from "@/app/tools/soroban-storage-ttl-inspector/copy";

export function SorobanStorageTtlInspectorEmptyState() {
  return <p className="text-sm text-[#4e5c73]">{copy.empty}</p>;
}
