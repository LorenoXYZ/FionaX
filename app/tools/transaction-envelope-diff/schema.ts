import type {
  TransactionEnvelopeDiffError,
  TransactionEnvelopeDiffInput
} from "@/app/tools/transaction-envelope-diff/types";

/** Envelope inputs are capped to keep decoding bounded and memory-constant. */
const MAX_ENVELOPE_CHARS = 1_000_000;

/** Base64 XDR uses A-Z, a-z, 0-9, +, / and optional padding. */
const BASE64_RE = /^[A-Za-z0-9+/]+={0,2}$/;

export type TransactionEnvelopeValidation =
  | { ok: true; input: TransactionEnvelopeDiffInput }
  | { ok: false; error: TransactionEnvelopeDiffError };

/**
 * Validate the two raw base64 envelopes before any decode. Fully offline; the
 * only work is reading the two pasted strings, so validation is about shape and
 * resource limits, not network behavior.
 */
export function validateTransactionEnvelopeDiffInput(
  leftRaw: string,
  rightRaw: string
): TransactionEnvelopeValidation {
  const left = leftRaw.trim();
  const right = rightRaw.trim();

  if (!left || !right) {
    return {
      ok: false,
      error: { code: "invalid_input", message: "Paste both transaction envelopes (base64 XDR) to compare." }
    };
  }

  if (left.length > MAX_ENVELOPE_CHARS || right.length > MAX_ENVELOPE_CHARS) {
    return {
      ok: false,
      error: { code: "too_large", message: "One of the envelopes is too large to decode." }
    };
  }

  if (!BASE64_RE.test(left) || !BASE64_RE.test(right)) {
    return {
      ok: false,
      error: { code: "invalid_input", message: "Envelopes must be base64-encoded XDR, not hex or raw bytes." }
    };
  }

  return {
    ok: true,
    input: { leftEnvelope: left, rightEnvelope: right }
  };
}
