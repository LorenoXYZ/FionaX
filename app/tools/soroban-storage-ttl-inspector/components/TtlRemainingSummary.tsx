import { formatLedger, formatRemaining } from "@/app/tools/soroban-storage-ttl-inspector/lib/format";
import type { StorageEntryResult } from "@/app/tools/soroban-storage-ttl-inspector/types";

export function TtlRemainingSummary({ entries }: { entries: StorageEntryResult[] }) {
  return (
    <ul className="space-y-1">
      {entries.map((entry) => (
        <li key={entry.id} className="font-mono text-sm text-[#172033]">
          {entry.id}: remaining {formatRemaining(entry)}, live until {formatLedger(entry.liveUntilLedgerSeq)}, ledger {formatLedger(entry.latestLedger)}
        </li>
      ))}
    </ul>
  );
}
