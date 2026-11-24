/**
 * Domain types for the Trustline Receiving Capacity Planner.
 *
 * Every amount is carried as a decimal string — never a JavaScript `number` —
 * because Stellar amounts are signed 64-bit stroops with seven decimal places
 * that can exceed `Number.MAX_SAFE_INTEGER`. All arithmetic happens on BigInt
 * (see lib/capacity-math.ts) so no precision is lost on the way in or out.
 */

export interface TrustlineCapacityInput {
  /** The account address that holds the trustline. */
  accountId: string;
  /** The asset code (e.g. "USDC"). */
  assetCode: string;
  /** The issuer address the asset code is bound to. */
  issuerId: string;
  /** Raw pasted Horizon balance record (JSON text) for the trustline. */
  rawRecord: string;
}

export type TrustlineCapacityErrorCode =
  | "invalid_input"
  | "malformed_data"
  | "unsupported_variant"
  | "too_large";

export interface TrustlineCapacityError {
  code: TrustlineCapacityErrorCode;
  message: string;
}

/** The parsed, protocol-shaped trustline balance record. */
export interface TrustlineRecord {
  assetType: string;
  assetCode: string;
  assetIssuer: string;
  /** Decimal string, seven decimal places. */
  balance: string;
  /** Decimal string. */
  limit: string;
  /** Decimal string; may be absent from a Horizon record. */
  buyingLiabilities?: string;
  /** Decimal string; may be absent from a Horizon record. */
  sellingLiabilities?: string;
  isAuthorized: boolean;
  isAuthorizedToMaintainLiabilities: boolean;
}

export type AuthorizationState =
  | "authorized"
  | "authorized_to_maintain_liabilities"
  | "unauthorized";

export interface TrustlineCapacityResult {
  accountId: string;
  assetCode: string;
  issuerId: string;
  /** limit - balance - buyingLiabilities, exact seven-decimal string. */
  receivingCapacity: string;
  /** Exact seven-decimal string. */
  limit: string;
  /** Exact seven-decimal string. */
  balance: string;
  /** Exact seven-decimal string; "0" when the record omits it. */
  buyingLiabilities: string;
  authorization: AuthorizationState;
  /** True when liabilities were absent and treated as unknown, not zero. */
  liabilitiesIncomplete: boolean;
}
