import { StrKey } from "@stellar/stellar-sdk";
import type {
  TrustlineCapacityError,
  TrustlineCapacityInput
} from "@/app/tools/trustline-capacity-planner/types";

const SECRET_PREFIX = /^S/;
/** Pasted records are capped to keep parsing bounded and memory-constant. */
const MAX_RECORD_CHARS = 20_000;

export type TrustlineCapacityValidation =
  | { ok: true; input: TrustlineCapacityInput }
  | { ok: false; error: TrustlineCapacityError };

export function validateTrustlineCapacityInput(
  accountId: string,
  assetCode: string,
  issuerId: string,
  rawRecord: string
): TrustlineCapacityValidation {
  const account = accountId.trim();
  const code = assetCode.trim();
  const issuer = issuerId.trim();
  const record = rawRecord.trim();

  if (!account || !code || !issuer || !record) {
    return {
      ok: false,
      error: { code: "invalid_input", message: "Enter the account, asset code, issuer, and a pasted balance record." }
    };
  }

  if (SECRET_PREFIX.test(account) || !StrKey.isValidEd25519PublicKey(account)) {
    return {
      ok: false,
      error: { code: "invalid_input", message: "Enter a valid G… account ID. Secret seeds are rejected before any work." }
    };
  }

  if (SECRET_PREFIX.test(issuer) || !StrKey.isValidEd25519PublicKey(issuer)) {
    return {
      ok: false,
      error: { code: "invalid_input", message: "Enter a valid G… issuer ID. Secret seeds are rejected before any work." }
    };
  }

  if (code.length > 12) {
    return {
      ok: false,
      error: { code: "invalid_input", message: "Asset codes are at most 12 characters." }
    };
  }

  if (record.length > MAX_RECORD_CHARS) {
    return {
      ok: false,
      error: { code: "too_large", message: "The pasted record is too large. Paste a single balance entry, not the whole account." }
    };
  }

  return {
    ok: true,
    input: { accountId: account, assetCode: code, issuerId: issuer, rawRecord: record }
  };
}
