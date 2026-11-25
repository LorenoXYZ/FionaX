import type { SignerQuorumSimulatorErrorCode } from "@/app/tools/signer-quorum-simulator/types";

export const copy = {
  title: "Signer Quorum Simulator",
  eyebrow: "Accounts",
  idle: "Paste a public account's JSON and pick a subset of its signers to see which thresholds that subset would reach.",
  loading: "Tallying signer weights…",
  empty: "Nothing is signed or submitted. The simulator only adds signer weights and compares them to the account thresholds.",
  accountPlaceholder: "Paste Horizon account JSON here",
  selectionPlaceholder: "Signer keys, separated by commas or spaces",
  submit: "Simulate quorum",
  resultTitle: "Threshold verdicts",
  contributionsTitle: "Selected contributions",
  unresolvedTitle: "Not found on this account",
  unresolvedBody: "These selected keys do not match any signer on the account, so they add nothing to the tally.",
  incompleteNotice: "Some weights or thresholds were missing from the record, so the verdict treats them as unknown rather than zero.",
  errors: {
    invalid_input: "Enter a public account JSON and at least one signer key. Secret seeds are rejected.",
    malformed_data: "That JSON does not look like a Horizon account record. Check that it is valid public account data.",
    unsupported_variant: "This account record uses a signer type the simulator cannot parse. Check the record format.",
    too_large: "The pasted account JSON or signer selection is too large to process."
  } satisfies Record<SignerQuorumSimulatorErrorCode, string>
};
