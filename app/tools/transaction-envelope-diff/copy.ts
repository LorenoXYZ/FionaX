import type { TransactionEnvelopeDiffErrorCode } from "@/app/tools/transaction-envelope-diff/types";

export const copy = {
  title: "Transaction Envelope Semantic Diff",
  eyebrow: "Transactions",
  idle: "Paste two transaction envelopes to see what changed between them — sources, memo, operations, and signatures.",
  loading: "Comparing envelopes…",
  empty: "Nothing is signed or submitted. The diff only decodes and compares the two envelopes locally.",
  leftPlaceholder: "First envelope (base64 XDR)",
  rightPlaceholder: "Second envelope (base64 XDR)",
  submit: "Compare envelopes",
  resultTitle: "Differences",
  identicalTitle: "Semantically identical",
  identicalBody: "The two envelopes mean the same thing. A different base64 encoding does not count as a change.",
  fieldsTitle: "Field changes",
  operationsTitle: "Operation changes",
  signaturesTitle: "Signature changes",
  signatureOnlyBody: "Only the signature set differs; the payload is unchanged.",
  feeBumpOnlyBody: "Only the fee-bump layer differs; the inner transaction is unchanged.",
  errors: {
    invalid_input: "Paste two base64-encoded transaction envelopes. Hex and raw bytes are not accepted.",
    malformed_data: "One of the envelopes is not a valid transaction envelope XDR.",
    unsupported_variant: "One of the envelopes uses an XDR variant this tool cannot decode.",
    too_large: "One of the envelopes is too large to decode."
  } satisfies Record<TransactionEnvelopeDiffErrorCode, string>
};
