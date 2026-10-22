export type SequenceInspectorErrorCode = "invalid_account" | "account_not_found" | "rate_limited" | "request_failed";

export interface SequenceInspectorError {
  code: SequenceInspectorErrorCode;
  message: string;
}

export interface SequenceInspectorInput {
  accountId: string;
}

export interface SequenceInspectorResult {
  accountId: string;
  /** The account's current sequence number, as returned by Horizon. Decimal string — exceeds Number.MAX_SAFE_INTEGER. */
  currentSequence: string;
  /** currentSequence + 1: the only sequence number a new transaction from this account may use right now. */
  nextSequence: string;
}
