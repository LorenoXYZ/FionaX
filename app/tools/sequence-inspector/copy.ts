import type { SequenceInspectorErrorCode } from "@/app/tools/sequence-inspector/types";

export const copy = {
  title: "Account Sequence Number Inspector",
  eyebrow: "Accounts",
  idle: "Enter an account to see its current sequence number and the next value a transaction must use.",
  loading: "Reading the account…",
  empty: "Reads the account's sequence number from Horizon — nothing is signed or submitted.",
  placeholder: "G… account ID",
  submit: "Inspect sequence",
  resultTitle: "Sequence numbers",
  currentLabel: "Current sequence number",
  currentHelp: "The last sequence number this account successfully used.",
  nextLabel: "Next valid sequence number",
  nextHelp: "Current sequence number + 1 — the only value a new transaction from this account may use right now.",
  rawLabel: "Raw value",
  pendingWarningTitle: "A value can already be reserved",
  pendingWarningBody:
    "If this account has an unconfirmed transaction in flight, that transaction already reserved the next sequence number shown above. Submitting another transaction with the same number will be rejected — wait for the pending transaction to confirm or expire, then re-check before building a new one.",
  errors: {
    invalid_account: "Enter a valid G… account ID. Secret seeds are rejected before any request.",
    account_not_found: "No account exists for that ID on the selected network.",
    rate_limited: "Horizon is throttling requests. Wait a moment and try again.",
    request_failed: "The account lookup did not complete. Check the selected network and try again."
  } satisfies Record<SequenceInspectorErrorCode, string>
};
