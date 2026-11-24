import { xdr } from "@stellar/stellar-sdk";
import type { StorageEntryResult, TtlStatus } from "@/app/tools/soroban-storage-ttl-inspector/types";

export interface TtlEvidence {
  id: string;
  contractId: string;
  requestedDurability: "temporary" | "persistent";
  latestLedger: string | null;
  liveUntilLedgerSeq: string | null;
  entryXdr: string | null;
}

function integer(value: string | null): bigint | null {
  if (!value || !/^(0|[1-9][0-9]*)$/.test(value)) return null;
  return BigInt(value);
}

export function classifyTtl(evidence: TtlEvidence): StorageEntryResult {
  const base = {
    id: evidence.id,
    contractId: evidence.contractId,
    requestedDurability: evidence.requestedDurability,
    latestLedger: evidence.latestLedger,
    liveUntilLedgerSeq: evidence.liveUntilLedgerSeq,
    entryDurability: null as string | null,
    lastModifiedLedgerSeq: null as string | null,
    remainingLedgers: null as string | null,
    status: "absent" as TtlStatus
  };
  if (!evidence.entryXdr) return base;
  let entry: xdr.LedgerEntry;
  try {
    entry = xdr.LedgerEntry.fromXDR(evidence.entryXdr, "base64");
  } catch {
    return { ...base, status: "malformed" };
  }
  base.lastModifiedLedgerSeq = String(entry.lastModifiedLedgerSeq());
  const kind = entry.data().switch().name;
  if (kind !== "contractData") return { ...base, status: "unsupported" };
  base.entryDurability = entry.data().contractData().durability().name;
  const liveUntil = integer(evidence.liveUntilLedgerSeq);
  const latest = integer(evidence.latestLedger);
  if (liveUntil === null || latest === null) return { ...base, status: "unknown" };
  if (liveUntil <= latest) return { ...base, status: "expired" };
  return { ...base, status: "live", remainingLedgers: (liveUntil - latest).toString() };
}
