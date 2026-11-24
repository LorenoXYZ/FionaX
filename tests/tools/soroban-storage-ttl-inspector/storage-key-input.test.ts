import { describe, expect, it } from "vitest";
import { encodeStorageKey } from "@/app/tools/soroban-storage-ttl-inspector/lib/storage-key-input";
import { persistentKey, temporaryKey } from "@/tests/tools/soroban-storage-ttl-inspector/fixtures/normal.fixture";

describe("encodeStorageKey", () => {
  it("encodes persistent and temporary keys as different XDR", () => {
    const persistent = encodeStorageKey(persistentKey);
    const temporary = encodeStorageKey({ ...temporaryKey, contractId: persistentKey.contractId, id: "temp" });
    expect(persistent.ok && temporary.ok).toBe(true);
    if (persistent.ok && temporary.ok) expect(persistent.encoded.xdr).not.toBe(temporary.encoded.xdr);
  });

  it("rejects a contract id that fails the checksum", () => {
    expect(encodeStorageKey({ ...persistentKey, contractId: "CINVALID" }).ok).toBe(false);
  });
});
