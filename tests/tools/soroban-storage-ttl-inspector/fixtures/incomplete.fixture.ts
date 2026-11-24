import { encoded, entryXdr, persistentKey, rpcBody, temporaryKey } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/normal.fixture";
import { encodeStorageKey } from "@/app/tools/soroban-storage-ttl-inspector/lib/storage-key-input";

export function mixedBody() {
  const present = encoded(persistentKey);
  const missing = encodeStorageKey(temporaryKey);
  if (!missing.ok) throw new Error(missing.error.message);
  return {
    body: rpcBody([{ key: present.xdr, xdr: entryXdr("persistent"), liveUntilLedgerSeq: 250 }], 100),
    missingId: temporaryKey.id
  };
}

export function unknownTtlBody() {
  return rpcBody([{ key: encoded().xdr, xdr: entryXdr() }], 100);
}
