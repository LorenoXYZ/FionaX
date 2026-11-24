import { StrKey } from "@stellar/stellar-sdk";
import type { StorageKeyInput, TtlError, TtlInput } from "@/app/tools/soroban-storage-ttl-inspector/types";

export const MAX_KEYS = 20;
export const MAX_JSON_LENGTH = 20_000;
const SECRET_SEED = /^S[A-Z2-7]{55}$/;

function fail(code: TtlError["code"], message: string): { ok: false; error: TtlError } {
  return { ok: false, error: { code, message } };
}

export function validateTtlInput(raw: string): { ok: true; input: TtlInput } | { ok: false; error: TtlError } {
  const text = raw.trim();
  if (!text) return fail("invalid_input", "Paste the storage keys to inspect.");
  if (text.split(/\s+/).some((token) => SECRET_SEED.test(token))) {
    return fail("invalid_input", "A secret seed was rejected and was not stored.");
  }
  if (text.length > MAX_JSON_LENGTH) return fail("too_large", "The key list is over 20,000 characters.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return fail("malformed_data", "The key list is not JSON.");
  }
  if (typeof parsed !== "object" || parsed === null) return fail("malformed_data", "Paste one JSON object.");
  const record = parsed as { network?: unknown; keys?: unknown };
  if (record.network !== "testnet" && record.network !== "mainnet") {
    return fail("invalid_input", "Choose testnet or mainnet.");
  }
  if (!Array.isArray(record.keys) || record.keys.length === 0) return fail("invalid_input", "Add at least one storage key.");
  if (record.keys.length > MAX_KEYS) return fail("too_large", "Inspect at most 20 storage keys.");
  const keys: StorageKeyInput[] = [];
  const ids = new Set<string>();
  for (const item of record.keys) {
    if (typeof item !== "object" || item === null) return fail("malformed_data", "Each key must be an object.");
    const key = item as Record<string, unknown>;
    if (typeof key.id !== "string" || key.id.length === 0 || ids.has(key.id)) {
      return fail("invalid_input", "Each key needs its own id.");
    }
    if (typeof key.contractId !== "string" || !StrKey.isValidContract(key.contractId)) {
      return fail("invalid_input", "Each key needs a valid C… contract ID.");
    }
    if (key.durability !== "temporary" && key.durability !== "persistent") {
      return fail("unsupported_variant", "Durability is temporary or persistent.");
    }
    const spec = key.key as { type?: unknown; value?: unknown } | undefined;
    if (!spec || (spec.type !== "symbol" && spec.type !== "string" && spec.type !== "u32" && spec.type !== "u64" && spec.type !== "address") || typeof spec.value !== "string") {
      return fail("unsupported_variant", "A key type must be symbol, string, u32, u64, or address.");
    }
    ids.add(key.id);
    keys.push({ id: key.id, contractId: key.contractId, durability: key.durability, keyType: spec.type, keyValue: spec.value });
  }
  return { ok: true, input: { network: record.network, keys } };
}
