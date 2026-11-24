import { encoded, rpcBody } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/normal.fixture";

export function badEntryBody() {
  return rpcBody([{ key: encoded().xdr, xdr: "AAAA", liveUntilLedgerSeq: 200 }], 100);
}

export const notJson = "{";
