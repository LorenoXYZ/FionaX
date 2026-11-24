import type { TtlErrorCode } from "@/app/tools/soroban-storage-ttl-inspector/types";

export const copy = {
  title: "Soroban Storage TTL Inspector",
  eyebrow: "Soroban",
  idle: "Read up to 20 contract storage keys and show the TTL evidence Soroban RPC actually returned.",
  loading: "Reading ledger entries…",
  empty: "Each key needs a contract, a durability, and a typed key. Missing entries stay absent.",
  keysLabel: "Storage keys JSON",
  submit: "Inspect TTL",
  resultTitle: "Storage TTL",
  errors: {
    invalid_input: "Choose a network and give each key an id, a C… contract, and a typed value. Secret seeds are refused.",
    malformed_data: "The key list or a ledger entry could not be read.",
    unsupported_variant: "Durability is temporary or persistent. Key types are symbol, string, u32, u64, or address.",
    too_large: "Inspect at most 20 keys.",
    not_found: "Soroban RPC reported the request as not found. An absent key inside a batch stays a row.",
    rate_limited: "Soroban RPC rate limited this lookup. Wait and try the same keys again.",
    request_failed: "The ledger lookup did not complete."
  } satisfies Record<TtlErrorCode, string>
};
