import type { StorageEntryResult } from "@/app/tools/soroban-storage-ttl-inspector/types";

export function formatRemaining(entry: StorageEntryResult): string {
  if (entry.remainingLedgers === null) return "not declared";
  return entry.remainingLedgers;
}

export function formatLedger(value: string | null): string {
  return value ?? "not declared";
}
