import { StrKey } from "@stellar/stellar-sdk";
import type { EventFilterError, EventFilterInput, FilterGroupInput, TopicPieceInput } from "@/app/tools/soroban-event-filter-builder/types";

export const MAX_FILTERS = 5;
export const MAX_CONTRACT_IDS = 5;
export const MAX_LIMIT = 10000;
const LEDGER_MAX = 4294967295n;
const INTEGER = /^(0|[1-9][0-9]*)$/;

function fail(code: EventFilterError["code"], message: string): { ok: false; error: EventFilterError } {
  return { ok: false, error: { code, message } };
}

function ledger(value: unknown, label: string): { ok: true; value: string | null } | { ok: false; error: EventFilterError } {
  if (value === undefined || value === null || value === "") return { ok: true, value: null };
  if (typeof value !== "string" && typeof value !== "number") {
    return fail("invalid_input", `${label} must be a ledger sequence.`);
  }
  const text = String(value);
  if (!INTEGER.test(text) || text === "0" || BigInt(text) > LEDGER_MAX) {
    return fail("invalid_input", `${label} must be a ledger sequence from 1 to 4294967295.`);
  }
  return { ok: true, value: text };
}

function readPiece(value: unknown): TopicPieceInput | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as { type?: unknown; value?: unknown };
  const type = record.type;
  if (
    type !== "symbol" &&
    type !== "string" &&
    type !== "u32" &&
    type !== "u64" &&
    type !== "i64" &&
    type !== "bool" &&
    type !== "address" &&
    type !== "bytes" &&
    type !== "wildcard"
  ) {
    return null;
  }
  if (typeof record.value !== "string") return null;
  return { type, value: record.value };
}

export function readEventFilterInput(parsed: unknown): { ok: true; input: EventFilterInput } | { ok: false; error: EventFilterError } {
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return fail("malformed_data", "Paste one JSON object describing the getEvents filter.");
  }
  const record = parsed as Record<string, unknown>;
  const start = ledger(record.startLedger, "startLedger");
  if (!start.ok) return start;
  const end = ledger(record.endLedger, "endLedger");
  if (!end.ok) return end;
  if (start.value && end.value && BigInt(start.value) >= BigInt(end.value)) {
    return fail("invalid_input", "endLedger is exclusive, so it must be greater than startLedger.");
  }
  if (record.cursor !== undefined && (start.value || end.value)) {
    return fail("unsupported_variant", "A cursor request cannot also set startLedger or endLedger.");
  }

  let limit: string | null = null;
  if (record.limit !== undefined && record.limit !== null && record.limit !== "") {
    const text = String(record.limit);
    if (!INTEGER.test(text) || text === "0") return fail("invalid_input", "pagination limit must be an integer from 1 to 10000.");
    if (BigInt(text) > BigInt(MAX_LIMIT)) return fail("too_large", "getEvents accepts at most 10000 events per page.");
    limit = text;
  }

  if (!Array.isArray(record.filters)) return fail("malformed_data", "filters must be an array.");
  if (record.filters.length === 0) return fail("invalid_input", "Add at least one filter. An empty list is not a request.");
  if (record.filters.length > MAX_FILTERS) return fail("too_large", "getEvents allows at most 5 filters.");

  const filters: FilterGroupInput[] = [];
  let contractCount = 0;
  for (const rawFilter of record.filters) {
    if (typeof rawFilter !== "object" || rawFilter === null || Array.isArray(rawFilter)) {
      return fail("malformed_data", "Each filter must be an object.");
    }
    const filter = rawFilter as Record<string, unknown>;
    let type: "contract" | "system" | null = null;
    if (filter.type !== undefined) {
      if (filter.type !== "contract" && filter.type !== "system") {
        return fail("unsupported_variant", "A filter type is contract or system.");
      }
      type = filter.type;
    }
    const contractIds: string[] = [];
    if (filter.contractIds !== undefined) {
      if (!Array.isArray(filter.contractIds)) return fail("malformed_data", "contractIds must be an array.");
      for (const id of filter.contractIds) {
        if (typeof id !== "string" || !StrKey.isValidContract(id)) {
          return fail("invalid_input", "Each contract ID must be a valid C… contract address.");
        }
        contractIds.push(id);
      }
    }
    contractCount += contractIds.length;
    if (contractCount > MAX_CONTRACT_IDS) return fail("too_large", "getEvents allows at most 5 contract IDs per request.");
    if (!Array.isArray(filter.topics)) return fail("malformed_data", "topics must be an array of topic filters.");
    const topics = [];
    for (const topic of filter.topics) {
      if (!Array.isArray(topic)) return fail("malformed_data", "Each topic filter is an array of segments.");
      const segments: TopicPieceInput[] = [];
      for (const piece of topic) {
        const read = readPiece(piece);
        if (!read) return fail("unsupported_variant", "A topic segment type is not supported.");
        segments.push(read);
      }
      topics.push({ segments });
    }
    filters.push({ type, contractIds, topics });
  }

  return { ok: true, input: { startLedger: start.value, endLedger: end.value, limit, filters } };
}
