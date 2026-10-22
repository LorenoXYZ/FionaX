import { StrKey } from "@stellar/stellar-sdk";
import type { SequenceInspectorError, SequenceInspectorInput } from "@/app/tools/sequence-inspector/types";

const SECRET_PREFIX = /^S/;

export function validateSequenceInspectorInput(
  raw: string
): { ok: true; input: SequenceInspectorInput } | { ok: false; error: SequenceInspectorError } {
  const accountId = raw.trim();

  if (!accountId) {
    return { ok: false, error: { code: "invalid_account", message: "Enter a Stellar account ID first." } };
  }
  if (SECRET_PREFIX.test(accountId) || !StrKey.isValidEd25519PublicKey(accountId)) {
    return { ok: false, error: { code: "invalid_account", message: "Enter a valid G… account ID. Secret seeds are rejected before any request." } };
  }

  return { ok: true, input: { accountId } };
}
