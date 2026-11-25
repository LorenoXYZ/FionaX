import type {
  TransactionEnvelopeDiffInput,
  TransactionEnvelopeDiffResult
} from "@/app/tools/transaction-envelope-diff/types";
import {
  normalizeEnvelope,
  EnvelopeDecodeError
} from "@/app/tools/transaction-envelope-diff/lib/envelope-normalize";
import { diffFields, diffOperations } from "@/app/tools/transaction-envelope-diff/lib/semantic-diff";
import { diffSignatures } from "@/app/tools/transaction-envelope-diff/lib/signature-diff";

/**
 * Compose the decode/normalize/diff modules into the final result. Fully
 * offline: it decodes the two envelopes locally, normalizes every nested value,
 * and reports field, operation and signature differences separately.
 */
export function runTransactionEnvelopeDiff(
  input: TransactionEnvelopeDiffInput
): TransactionEnvelopeDiffResult {
  const left = normalizeEnvelope(input.leftEnvelope);
  const right = normalizeEnvelope(input.rightEnvelope);

  const fieldDiffs = diffFields(left, right);
  const operationDiffs = diffOperations(left, right);
  const signatureDiffs = diffSignatures(left, right);

  const identical =
    fieldDiffs.length === 0 && operationDiffs.length === 0 && signatureDiffs.length === 0;

  // A fee-bump-only change means the inner transaction matches, but the outer
  // fee-bump layer (fee source or fee) differs.
  const feeBumpOnlyChange =
    left.kind === "fee_bump" &&
    right.kind === "fee_bump" &&
    left.innerEnvelope === right.innerEnvelope &&
    (left.sourceAccount !== right.sourceAccount || left.fee !== right.fee);

  return {
    leftKind: left.kind,
    rightKind: right.kind,
    identical,
    fieldDiffs,
    operationDiffs,
    signatureDiffs,
    feeBumpOnlyChange
  };
}

export { EnvelopeDecodeError };
