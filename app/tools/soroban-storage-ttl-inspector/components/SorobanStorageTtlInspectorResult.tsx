import { StorageEntryRows } from "@/app/tools/soroban-storage-ttl-inspector/components/StorageEntryRows";
import { StorageEvidenceNotice } from "@/app/tools/soroban-storage-ttl-inspector/components/StorageEvidenceNotice";
import { TtlRemainingSummary } from "@/app/tools/soroban-storage-ttl-inspector/components/TtlRemainingSummary";
import { copy } from "@/app/tools/soroban-storage-ttl-inspector/copy";
import type { TtlResult } from "@/app/tools/soroban-storage-ttl-inspector/types";

export function SorobanStorageTtlInspectorResult({ result }: { result: TtlResult }) {
  return (
    <section aria-label={copy.resultTitle} className="space-y-3">
      <h2 className="text-lg font-bold text-[#172033]">{copy.resultTitle}</h2>
      <p className="text-sm text-[#4e5c73]">{result.network} · {result.provider}</p>
      <StorageEvidenceNotice result={result} />
      <StorageEntryRows entries={result.entries} />
      <TtlRemainingSummary entries={result.entries} />
    </section>
  );
}
