import type { TransactionEnvelopeDiffError } from "@/app/tools/transaction-envelope-diff/types";
import { EnvelopeDecodeError } from "@/app/tools/transaction-envelope-diff/lib/envelope-normalize";

const CODE_MESSAGES: Record<TransactionEnvelopeDiffError["code"], string> = {
  invalid_input: "Paste two base64-encoded transaction envelopes. Hex and raw bytes are not accepted.",
  malformed_data: "One of the envelopes is not a valid transaction envelope XDR.",
  unsupported_variant: "One of the envelopes uses an XDR variant this tool cannot decode.",
  too_large: "One of the envelopes is too large to decode."
};

/** Map a thrown value to a user-facing tool error with stable copy. */
export function toToolError(error: unknown): TransactionEnvelopeDiffError {
  if (error instanceof EnvelopeDecodeError) {
    return { code: error.code, message: CODE_MESSAGES[error.code] };
  }
  if (error instanceof Error) {
    return { code: "malformed_data", message: CODE_MESSAGES.malformed_data };
  }
  return { code: "malformed_data", message: CODE_MESSAGES.malformed_data };
}
