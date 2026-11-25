/**
 * Domain types for the Signer Quorum Simulator.
 *
 * A Stellar account authorizes operations through a set of signers, each with
 * an unsigned 8-bit weight, and three thresholds (low, medium, high) that a
 * collected subset must reach. This tool simulates a local selection of
 * signers without collecting a single signature: it only adds weights and
 * compares them against the thresholds.
 *
 * Weights and thresholds are plain non-negative integers (0..255), so they fit
 * safely in a JavaScript `number`. No Stellar amounts are involved here, so the
 * BigInt decimal discipline used elsewhere does not apply.
 */

export type SignerType = "ed25519" | "preauth_tx" | "sha256_hash";

export type ThresholdLevel = "low" | "medium" | "high";

/** A single account signer, normalized from the pasted Horizon account JSON. */
export interface AccountSigner {
  /** Weight as an integer 0..255, or null when the record omitted it. */
  weight: number | null;
  /** The signer key type carried by the record. */
  type: SignerType;
  /** The raw key value, kept lossless for display. */
  key: string;
  /** Present only for the account's master key signer. */
  isMasterKey: boolean;
}

/** The parsed, protocol-shaped view of a pasted account record. */
export interface SignerSnapshot {
  accountId: string;
  /** Deterministically ordered: master key first, then ed25519/preauth/hash signers. */
  signers: AccountSigner[];
  thresholds: Record<ThresholdLevel, number | null>;
  /** The master key weight, or null when the master key is disabled. */
  masterKeyWeight: number | null;
}

export interface SignerQuorumSimulatorInput {
  /** Raw pasted Horizon account JSON text. */
  rawAccountJson: string;
  /** Local selection of signer identifiers, in the order the user picked. */
  selectedKeys: string[];
}

export type SignerQuorumSimulatorErrorCode =
  | "invalid_input"
  | "malformed_data"
  | "unsupported_variant"
  | "too_large";

export interface SignerQuorumSimulatorError {
  code: SignerQuorumSimulatorErrorCode;
  message: string;
}

/** The verdict for a single threshold after summing the selected weights. */
export interface ThresholdVerdict {
  level: ThresholdLevel;
  /** The threshold value, or null when the account omitted it. */
  threshold: number | null;
  /** The exact deduplicated sum of the selected signer weights. */
  selectedWeight: number;
  /** True when selectedWeight >= threshold. */
  reached: boolean;
  /** threshold - selectedWeight, or 0 when already reached or threshold is null. */
  shortfall: number;
}

/**
 * A signer that was selected but could not be resolved to any signer on the
 * account. Kept distinct from a zero-weight signer so missing evidence never
 * masquerades as a valid zero contribution.
 */
export interface UnresolvedSigner {
  key: string;
}

export interface SignerQuorumSimulatorResult {
  accountId: string;
  /** Deduplicated, order-stable contribution rows for the selection. */
  contributions: Array<{
    key: string;
    weight: number;
    isMasterKey: boolean;
    type: SignerType;
    /** True when this key appeared more than once in the selection. */
    duplicate: boolean;
  }>;
  verdicts: Record<ThresholdLevel, ThresholdVerdict>;
  unresolved: UnresolvedSigner[];
  /** True when any threshold or signer weight was missing from the record. */
  evidenceIncomplete: boolean;
}
