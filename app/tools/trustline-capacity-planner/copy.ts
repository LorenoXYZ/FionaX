import type { TrustlineCapacityErrorCode } from "@/app/tools/trustline-capacity-planner/types";

export const copy = {
  title: "Trustline Receiving Capacity Planner",
  eyebrow: "Assets & trustlines",
  idle: "Paste a Horizon trustline balance record to see exactly how much more the trustline can receive.",
  loading: "Reading the trustline…",
  empty: "Nothing is fetched, signed, or submitted — this tool reads only what you paste.",
  submit: "Plan capacity",
  resultTitle: "Receiving capacity",
  capacityLabel: "Remaining headroom",
  capacityHelp: "limit − balance − buying liabilities, to seven decimal places.",
  limitLabel: "Limit",
  balanceLabel: "Balance",
  buyingLiabilitiesLabel: "Buying liabilities",
  authorizationLabel: "Authorization",
  incompleteNoticeTitle: "Liabilities not shown",
  incompleteNoticeBody:
    "This record does not include buying or selling liabilities, so liabilities are treated as unknown rather than zero. Re-check the capacity against a full record before relying on it.",
  errors: {
    invalid_input: "Check the account, asset code, issuer, and pasted record, then try again.",
    malformed_data: "The pasted record could not be read as a single Horizon balance entry.",
    unsupported_variant: "This record is not an issued-asset trustline, so it has no receiving capacity.",
    too_large: "The pasted text is too large. Paste a single balance entry."
  } satisfies Record<TrustlineCapacityErrorCode, string>
};
