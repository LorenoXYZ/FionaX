/**
 * Domain types for the Transaction Envelope Semantic Diff.
 *
 * Two Stellar transaction envelopes are decoded from XDR and normalized into a
 * canonical, deterministic shape before comparison. Every nested value that can
 * vary by encoding but not by meaning (amounts, assets, muxed accounts, memos,
 * preconditions, operations) is reduced to its canonical XDR bytes, so two
 * envelopes that mean the same thing compare equal even when their base64
 * encodings differ. Signatures are compared as a separate, order-insensitive
 * set so a re-signature is never reported as a payload change.
 */

export type EnvelopeKind = "v0" | "v1" | "fee_bump";

export type DiffChangeKind = "added" | "removed" | "changed";

/** One field-level semantic difference between the two envelopes. */
export interface FieldDiff {
  /** Human-readable path, e.g. "sourceAccount" or "operations[2]". */
  path: string;
  kind: DiffChangeKind;
  /** Canonical value on the left (before) side; absent for additions. */
  before?: string;
  /** Canonical value on the right (after) side; absent for removals. */
  after?: string;
}

/** One operation-level difference, reported in envelope order. */
export interface OperationDiff {
  /** Zero-based operation index. */
  index: number;
  kind: DiffChangeKind;
  before?: string;
  after?: string;
}

/** One signature-level difference; signatures are compared as a set. */
export interface SignatureDiff {
  kind: DiffChangeKind;
  /** Canonical signature value. */
  value: string;
}

export interface TransactionEnvelopeDiffInput {
  /** Base64 XDR of the left (before) envelope. */
  leftEnvelope: string;
  /** Base64 XDR of the right (after) envelope. */
  rightEnvelope: string;
}

export type TransactionEnvelopeDiffErrorCode =
  | "invalid_input"
  | "malformed_data"
  | "unsupported_variant"
  | "too_large";

export interface TransactionEnvelopeDiffError {
  code: TransactionEnvelopeDiffErrorCode;
  message: string;
}

export interface TransactionEnvelopeDiffResult {
  leftKind: EnvelopeKind;
  rightKind: EnvelopeKind;
  /** True when both envelopes are semantically identical. */
  identical: boolean;
  /** Field-level differences (excluding operations and signatures). */
  fieldDiffs: FieldDiff[];
  /** Operation insertions, deletions and changes in envelope order. */
  operationDiffs: OperationDiff[];
  /** Signature-only differences, kept distinct from payload changes. */
  signatureDiffs: SignatureDiff[];
  /** True when the fee-bump layer differs but the inner transaction matches. */
  feeBumpOnlyChange: boolean;
}
