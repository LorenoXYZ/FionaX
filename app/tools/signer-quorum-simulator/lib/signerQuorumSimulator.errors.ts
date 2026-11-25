import type { SignerQuorumSimulatorError } from "@/app/tools/signer-quorum-simulator/types";
import { SignerSnapshotError } from "@/app/tools/signer-quorum-simulator/lib/signer-snapshot";

const CODE_MESSAGES: Record<SignerQuorumSimulatorError["code"], string> = {
  invalid_input: "Enter a public account JSON and at least one signer key. Secret seeds are rejected.",
  malformed_data: "That JSON does not look like a Horizon account record. Check that it is valid public account data.",
  unsupported_variant: "This account record uses a signer type the simulator cannot parse. Check the record format.",
  too_large: "The pasted account JSON or signer selection is too large to process."
};

/** Map a thrown value to a user-facing tool error with stable copy. */
export function toToolError(error: unknown): SignerQuorumSimulatorError {
  if (error instanceof SignerSnapshotError) {
    return { code: error.code, message: CODE_MESSAGES[error.code] };
  }
  if (error instanceof Error) {
    return { code: "malformed_data", message: CODE_MESSAGES.malformed_data };
  }
  return { code: "malformed_data", message: CODE_MESSAGES.malformed_data };
}
