import { encoded, entryXdr, rpcBody } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/normal.fixture";

export function exactExpiryBody() {
  const key = encoded();
  return rpcBody([{ key: key.xdr, xdr: entryXdr(), liveUntilLedgerSeq: 100 }], 100);
}

export function oneLedgerLeftBody() {
  const key = encoded();
  return rpcBody([{ key: key.xdr, xdr: entryXdr(), liveUntilLedgerSeq: 101 }], 100);
}
