import { Address, nativeToScVal, StrKey, xdr } from "@stellar/stellar-sdk";
import { encodeStorageKey } from "@/app/tools/soroban-storage-ttl-inspector/lib/storage-key-input";

export const contractId = StrKey.encodeContract(Buffer.alloc(32, 4));
export const otherContract = StrKey.encodeContract(Buffer.alloc(32, 5));

export const persistentKey = {
  id: "balance",
  contractId,
  durability: "persistent" as const,
  keyType: "symbol" as const,
  keyValue: "Balance"
};

export const temporaryKey = {
  id: "nonce",
  contractId: otherContract,
  durability: "temporary" as const,
  keyType: "symbol" as const,
  keyValue: "Nonce"
};

export function encoded(key = persistentKey) {
  const result = encodeStorageKey(key);
  if (!result.ok) throw new Error(result.error.message);
  return result.encoded;
}

export function entryXdr(durability: "temporary" | "persistent" = "persistent") {
  const data = xdr.LedgerEntryData.contractData(new xdr.ContractDataEntry({
    ext: new (xdr.ExtensionPoint as unknown as new (value: number) => xdr.ExtensionPoint)(0),
    contract: new Address(contractId).toScAddress(),
    key: nativeToScVal("Balance", { type: "symbol" }),
    durability: durability === "temporary" ? xdr.ContractDataDurability.temporary() : xdr.ContractDataDurability.persistent(),
    val: nativeToScVal(1, { type: "u32" })
  }));
  return new xdr.LedgerEntry({
    lastModifiedLedgerSeq: 40,
    data,
    ext: new (xdr.LedgerEntryExt as unknown as new (value: number) => xdr.LedgerEntryExt)(0)
  }).toXDR("base64");
}

export function rpcBody(entries: unknown[], latestLedger = 100) {
  return { jsonrpc: "2.0", result: { latestLedger, entries } };
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
