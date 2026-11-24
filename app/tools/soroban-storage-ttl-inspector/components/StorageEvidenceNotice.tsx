import type { TtlResult } from "@/app/tools/soroban-storage-ttl-inspector/types";

export function StorageEvidenceNotice({ result }: { result: TtlResult }) {
  if (result.completeness === "complete") return null;
  return (
    <p role="status" className="text-sm text-[#9a513f]">
      At least one key is absent, expired, unsupported, or has no live-until ledger. Remaining ledgers are shown only when that ledger was returned.
    </p>
  );
}
