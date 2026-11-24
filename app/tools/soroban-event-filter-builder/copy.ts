import type { EventFilterErrorCode } from "@/app/tools/soroban-event-filter-builder/types";

export const copy = {
  title: "Soroban Event Filter Builder",
  eyebrow: "Soroban",
  idle: "Build a getEvents filter from contract IDs, typed topics, and ledger bounds. Nothing is sent.",
  loading: "Encoding topics…",
  empty: "Paste the filter description. A missing start ledger stays missing.",
  filterLabel: "Filter JSON",
  submit: "Build filter",
  resultTitle: "getEvents preview",
  incompleteTitle: "The preview is incomplete",
  incompleteBody: "A start ledger or page limit was not supplied, so none was invented.",
  errors: {
    invalid_input: "Check the contract IDs, topic values, and ledger window. A secret seed is refused.",
    malformed_data: "Paste one JSON object. A topic that cannot be encoded is not a wildcard.",
    unsupported_variant: "Use a supported topic type, or contract/system as the filter type. ** belongs at the end.",
    too_large: "getEvents allows 5 filters, 5 contract IDs, 4 topic segments, and 10000 events per page."
  } satisfies Record<EventFilterErrorCode, string>
};
