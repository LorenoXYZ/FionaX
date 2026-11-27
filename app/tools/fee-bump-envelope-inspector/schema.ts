import type { InspectorError, InspectorInput } from "./types";
import { copy } from "./copy";
export const MAX_ENVELOPE_BYTES = 65536;
export const MAX_PASSPHRASE_CHARS = 256;
export type Validation = { ok: true; input: InspectorInput } | { ok: false; error: InspectorError };
export function validateInput(envelopeRaw: string, passphraseRaw: string): Validation {
  const envelope = envelopeRaw.trim();
  const passphrase = passphraseRaw;
  if (!envelope || !passphrase.trim() || /^S[A-Z2-7]{55}$/.test(envelope) || /^S[A-Z2-7]{55}$/.test(passphrase)) return { ok: false, error: { code: "invalid_input", message: copy.errors.invalid_input } };
  if (envelope.length > Math.ceil(MAX_ENVELOPE_BYTES / 3) * 4 || passphrase.length > MAX_PASSPHRASE_CHARS) return { ok: false, error: { code: "too_large", message: copy.errors.too_large } };
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(envelope)) return { ok: false, error: { code: "malformed_data", message: copy.errors.malformed_data } };
  let decoded: string;
  try { decoded = atob(envelope); } catch { return { ok: false, error: { code: "malformed_data", message: copy.errors.malformed_data } }; }
  if (decoded.length > MAX_ENVELOPE_BYTES) return { ok: false, error: { code: "too_large", message: copy.errors.too_large } };
  if (!decoded.length || btoa(decoded) !== envelope) return { ok: false, error: { code: "malformed_data", message: copy.errors.malformed_data } };
  return { ok: true, input: { envelope, passphrase } };
}
