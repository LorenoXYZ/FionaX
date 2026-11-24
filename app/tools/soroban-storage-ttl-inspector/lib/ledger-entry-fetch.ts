import type { EncodedStorageKey, StorageEntryResult, TtlError } from "@/app/tools/soroban-storage-ttl-inspector/types";
import { classifyTtl } from "@/app/tools/soroban-storage-ttl-inspector/lib/ttl-readiness";

export const RPC_URLS = {
  testnet: "https://soroban-testnet.stellar.org",
  mainnet: "https://mainnet.sorobanrpc.com"
} as const;

export interface FetchDeps {
  fetchImpl?: typeof fetch;
}

function fail(code: TtlError["code"], message: string): { ok: false; error: TtlError } {
  return { ok: false, error: { code, message } };
}

export async function fetchLedgerEntries(
  network: "testnet" | "mainnet",
  keys: EncodedStorageKey[],
  deps: FetchDeps = {},
  signal?: AbortSignal
): Promise<{ ok: true; latestLedger: string | null; entries: StorageEntryResult[] } | { ok: false; error: TtlError }> {
  const fetchImpl = deps.fetchImpl ?? globalThis.fetch;
  let response: Response;
  try {
    response = await fetchImpl(RPC_URLS[network], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getLedgerEntries",
        params: { keys: keys.map((key) => key.xdr) }
      }),
      signal
    });
  } catch {
    return fail("request_failed", "The Soroban RPC request did not complete.");
  }
  if (response.status === 429) return fail("rate_limited", "Soroban RPC rate limited this lookup.");
  if (!response.ok) return fail("request_failed", "Soroban RPC did not return ledger entries.");
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return fail("malformed_data", "Soroban RPC did not return JSON.");
  }
  if (typeof body !== "object" || body === null) return fail("malformed_data", "Soroban RPC returned an unexpected body.");
  const record = body as { error?: { message?: string }; result?: { latestLedger?: unknown; entries?: unknown } };
  if (record.error) {
    const message = record.error.message ?? "";
    if (/rate/i.test(message)) return fail("rate_limited", "Soroban RPC rate limited this lookup.");
    if (/not found/i.test(message)) return fail("not_found", "Soroban RPC reported that the request was not found.");
    return fail("request_failed", "Soroban RPC returned an error for this lookup.");
  }
  const result = record.result;
  if (!result || !Array.isArray(result.entries) || (typeof result.latestLedger !== "number" && typeof result.latestLedger !== "string")) {
    return fail("malformed_data", "The getLedgerEntries result has no latest ledger or entry list.");
  }
  const latestLedger = String(result.latestLedger);
  const returned = new Map<string, { xdr?: string; liveUntilLedgerSeq?: unknown }>();
  for (const entry of result.entries) {
    if (typeof entry !== "object" || entry === null) return fail("malformed_data", "A ledger entry was not an object.");
    const row = entry as { key?: unknown; xdr?: unknown; liveUntilLedgerSeq?: unknown };
    if (typeof row.key !== "string") return fail("malformed_data", "A ledger entry is missing its key.");
    returned.set(row.key, { xdr: typeof row.xdr === "string" ? row.xdr : undefined, liveUntilLedgerSeq: row.liveUntilLedgerSeq });
  }
  const entries = keys.map((key) => {
    const found = returned.get(key.xdr);
    const liveUntil = found && (typeof found.liveUntilLedgerSeq === "number" || typeof found.liveUntilLedgerSeq === "string")
      ? String(found.liveUntilLedgerSeq)
      : null;
    return classifyTtl({
      id: key.id,
      contractId: key.contractId,
      requestedDurability: key.durability,
      latestLedger,
      liveUntilLedgerSeq: liveUntil,
      entryXdr: found?.xdr ?? null
    });
  });
  return { ok: true, latestLedger, entries };
}
