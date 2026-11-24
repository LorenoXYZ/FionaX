import { Address, nativeToScVal, StrKey, xdr } from "@stellar/stellar-sdk";
import type { EncodedStorageKey, StorageKeyInput, TtlError } from "@/app/tools/soroban-storage-ttl-inspector/types";

function fail(code: TtlError["code"], message: string): { ok: false; error: TtlError } {
  return { ok: false, error: { code, message } };
}

function scVal(key: StorageKeyInput) {
  if (key.keyType === "symbol") return nativeToScVal(key.keyValue, { type: "symbol" });
  if (key.keyType === "string") return nativeToScVal(key.keyValue, { type: "string" });
  if (key.keyType === "u32") return nativeToScVal(Number(key.keyValue), { type: "u32" });
  if (key.keyType === "u64") return nativeToScVal(BigInt(key.keyValue), { type: "u64" });
  return nativeToScVal(key.keyValue, { type: "address" });
}

export function encodeStorageKey(key: StorageKeyInput): { ok: true; encoded: EncodedStorageKey } | { ok: false; error: TtlError } {
  if (!StrKey.isValidContract(key.contractId)) {
    return fail("invalid_input", "Each storage key needs a valid C… contract ID.");
  }
  if (key.durability !== "temporary" && key.durability !== "persistent") {
    return fail("unsupported_variant", "Durability is temporary or persistent.");
  }
  if (key.keyType === "u32" && (!/^(0|[1-9][0-9]*)$/.test(key.keyValue) || BigInt(key.keyValue) > 4294967295n)) {
    return fail("invalid_input", "A u32 key must fit in 32 bits.");
  }
  if (key.keyType === "u64" && !/^(0|[1-9][0-9]*)$/.test(key.keyValue)) {
    return fail("invalid_input", "A u64 key must be a non-negative integer.");
  }
  try {
    const ledgerKey = xdr.LedgerKey.contractData(new xdr.LedgerKeyContractData({
      contract: new Address(key.contractId).toScAddress(),
      key: scVal(key),
      durability: key.durability === "temporary" ? xdr.ContractDataDurability.temporary() : xdr.ContractDataDurability.persistent()
    }));
    return { ok: true, encoded: { id: key.id, contractId: key.contractId, durability: key.durability, xdr: ledgerKey.toXDR("base64") } };
  } catch {
    return fail("malformed_data", "That storage key could not be encoded.");
  }
}
