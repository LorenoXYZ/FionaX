import type { InspectorCode } from "./types";
export const copy = {
  title: "Offer Liability Coverage Inspector",
  idle: "Inspect up to 100 current offers across five Horizon pages on the selected network.",
  loading: "Reading account and offer pages…",
  processing: "Comparing exact liability totals…",
  empty: "Enter a public G… account ID. No signing or submission occurs.",
  errors: {
    invalid_input: "Enter a valid public G… account ID. Secret seeds are not accepted.",
    malformed_data: "Horizon returned malformed evidence. Retry later or check the selected network.",
    unsupported_variant: "This asset or network variant is unsupported.",
    too_large: "The input or amount exceeds the supported bound.",
    not_found: "The account was not found on the selected network.",
    rate_limited: "Horizon is limiting requests. Wait and retry.",
    request_failed: "The Horizon request failed. Check the network and retry."
  } satisfies Record<InspectorCode, string>
};
