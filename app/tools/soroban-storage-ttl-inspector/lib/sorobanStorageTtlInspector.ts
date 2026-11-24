import { fetchLedgerEntries, type FetchDeps } from "@/app/tools/soroban-storage-ttl-inspector/lib/ledger-entry-fetch";
import { encodeStorageKey } from "@/app/tools/soroban-storage-ttl-inspector/lib/storage-key-input";
import type { TtlError, TtlInput, TtlResult } from "@/app/tools/soroban-storage-ttl-inspector/types";

export async function runSorobanStorageTtlInspector(
  input: TtlInput,
  deps: FetchDeps = {},
  signal?: AbortSignal
): Promise<{ ok: true; result: TtlResult } | { ok: false; error: TtlError }> {
  const encoded = [];
  for (const key of input.keys) {
    const result = encodeStorageKey(key);
    if (!result.ok) return result;
    encoded.push(result.encoded);
  }
  const fetched = await fetchLedgerEntries(input.network, encoded, deps, signal);
  if (!fetched.ok) return fetched;
  const incomplete = fetched.entries.some((entry) => entry.status !== "live");
  return {
    ok: true,
    result: {
      network: input.network,
      latestLedger: fetched.latestLedger,
      entries: fetched.entries,
      completeness: incomplete ? "incomplete" : "complete",
      provider: "soroban-rpc"
    }
  };
}
