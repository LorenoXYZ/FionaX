import type { EventFilterError, EventFilterInput } from "@/app/tools/soroban-event-filter-builder/types";
import { readEventFilterInput } from "@/app/tools/soroban-event-filter-builder/lib/event-filter-input";

export const MAX_FILTER_JSON_LENGTH = 20_000;
const SECRET_SEED = /^S[A-Z2-7]{55}$/;

function fail(code: EventFilterError["code"], message: string): { ok: false; error: EventFilterError } {
  return { ok: false, error: { code, message } };
}

export function validateEventFilterInput(raw: string): { ok: true; input: EventFilterInput } | { ok: false; error: EventFilterError } {
  const text = raw.trim();
  if (!text) return fail("invalid_input", "Paste a getEvents filter. An empty box is not a request.");
  if (text.split(/\s+/).some((token) => SECRET_SEED.test(token))) {
    return fail("invalid_input", "A secret seed was rejected and was not stored.");
  }
  if (text.length > MAX_FILTER_JSON_LENGTH) return fail("too_large", "The filter JSON is over 20,000 characters.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return fail("malformed_data", "The filter is not JSON.");
  }
  return readEventFilterInput(parsed);
}
