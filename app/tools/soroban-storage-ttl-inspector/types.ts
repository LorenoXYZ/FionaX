export type TtlErrorCode =
  | "invalid_input"
  | "malformed_data"
  | "unsupported_variant"
  | "too_large"
  | "not_found"
  | "rate_limited"
  | "request_failed";

export interface TtlError {
  code: TtlErrorCode;
  message: string;
}

export type StorageDurability = "temporary" | "persistent";
export type TtlStatus = "live" | "expired" | "unknown" | "absent" | "unsupported" | "malformed";

export interface StorageKeyInput {
  id: string;
  contractId: string;
  durability: StorageDurability;
  keyType: "symbol" | "string" | "u32" | "u64" | "address";
  keyValue: string;
}

export interface TtlInput {
  network: "testnet" | "mainnet";
  keys: StorageKeyInput[];
}

export interface EncodedStorageKey {
  id: string;
  contractId: string;
  durability: StorageDurability;
  xdr: string;
}

export interface StorageEntryResult {
  id: string;
  contractId: string;
  requestedDurability: StorageDurability;
  entryDurability: string | null;
  status: TtlStatus;
  latestLedger: string | null;
  liveUntilLedgerSeq: string | null;
  lastModifiedLedgerSeq: string | null;
  remainingLedgers: string | null;
}

export interface TtlResult {
  network: "testnet" | "mainnet";
  latestLedger: string | null;
  entries: StorageEntryResult[];
  completeness: "complete" | "incomplete";
  provider: "soroban-rpc";
}
