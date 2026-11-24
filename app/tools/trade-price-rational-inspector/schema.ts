import type { InspectorError, InspectorInput } from "@/app/tools/trade-price-rational-inspector/types";
export const MAX_ROWS = 100;
export const MAX_CHARACTERS = 256_000;
type Validation = { ok: true; input: InspectorInput } | { ok: false; error: InspectorError };
export function validateTradePriceRationalInspectorInput(raw: string): Validation {
  if (!raw.trim()) return { ok: false, error: { code: "invalid_input", message: "Paste a trade array or Horizon trades page." } };
  if (raw.length > MAX_CHARACTERS) return { ok: false, error: { code: "too_large", message: "Input exceeds 256,000 characters." } };
  if (/S[A-Z2-7]{55}/i.test(raw)) return { ok: false, error: { code: "invalid_input", message: "Secret seeds are not accepted." } };
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return { ok: false, error: { code: "malformed_data", message: "Paste valid JSON." } }; }
  let source: InspectorInput["source"] = "array";
  if (!Array.isArray(value) && value !== null && typeof value === "object" && "_embedded" in value) {
    source = "horizon_page";
    const embedded = (value as { _embedded?: unknown })._embedded;
    value = embedded && typeof embedded === "object" ? (embedded as { records?: unknown }).records : undefined;
  }
  if (!Array.isArray(value)) return { ok: false, error: { code: "unsupported_variant", message: "Expected an array or a Horizon page with _embedded.records." } };
  if (value.length > MAX_ROWS) return { ok: false, error: { code: "too_large", message: "A batch may contain at most 100 trades." } };
  if (value.length === 0) return { ok: false, error: { code: "invalid_input", message: "No trade records were supplied." } };
  return { ok: true, input: { records: value, source } };
}
