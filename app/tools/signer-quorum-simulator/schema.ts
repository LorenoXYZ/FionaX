import { StrKey } from "@stellar/stellar-sdk";
import type {
  SignerQuorumSimulatorError,
  SignerQuorumSimulatorInput
} from "@/app/tools/signer-quorum-simulator/types";

/** Pasted account JSON is capped to keep parsing bounded and memory-constant. */
const MAX_JSON_CHARS = 200_000;
/** The local selection is capped to keep the simulation bounded. */
const MAX_SELECTED_KEYS = 64;

const SECRET_PREFIX = /^S/;

export type SignerQuorumValidation =
  | { ok: true; input: SignerQuorumSimulatorInput }
  | { ok: false; error: SignerQuorumSimulatorError };

/**
 * Validate the raw form values before any parsing. This tool is fully offline:
 * the only "request" is reading the pasted JSON, so validation here is about
 * shape and resource limits, not network behavior.
 */
export function validateSignerQuorumSimulatorInput(
  rawAccountJson: string,
  rawSelection: string
): SignerQuorumValidation {
  const json = rawAccountJson.trim();
  const selection = rawSelection.trim();

  if (!json) {
    return {
      ok: false,
      error: { code: "invalid_input", message: "Paste the account JSON from Horizon first." }
    };
  }

  if (json.length > MAX_JSON_CHARS) {
    return {
      ok: false,
      error: { code: "too_large", message: "The pasted account JSON is too large. Paste a single account record, not the whole ledger." }
    };
  }

  // Reject secret seeds as early as possible, before any decode attempt.
  if (SECRET_PREFIX.test(json)) {
    return {
      ok: false,
      error: { code: "invalid_input", message: "Secret seeds are rejected. Paste public account JSON only." }
    };
  }

  const selectedKeys = selection
    .split(/[\s,]+/)
    .map((key) => key.trim())
    .filter((key) => key.length > 0);

  if (selectedKeys.length === 0) {
    return {
      ok: false,
      error: { code: "invalid_input", message: "Select at least one signer to simulate a quorum." }
    };
  }

  if (selectedKeys.length > MAX_SELECTED_KEYS) {
    return {
      ok: false,
      error: { code: "too_large", message: "Select at most 64 signers at once." }
    };
  }

  for (const key of selectedKeys) {
    if (SECRET_PREFIX.test(key)) {
      return {
        ok: false,
        error: { code: "invalid_input", message: "Secret seeds are rejected. Select signers by their public key or hash." }
      };
    }
  }

  return {
    ok: true,
    input: { rawAccountJson: json, selectedKeys }
  };
}

/** True when a raw signer key value parses as a valid ed25519 public key. */
export function isEd25519Key(key: string): boolean {
  try {
    return StrKey.isValidEd25519PublicKey(key);
  } catch {
    return false;
  }
}
