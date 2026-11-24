import type { InspectorErrorCode } from "@/app/tools/trade-price-rational-inspector/types";
export const copy = {
  title: "Trade Price Rational Inspector",
  idle: "Paste up to 100 Horizon trade records to inspect their quantity ratio against the rational offer price.",
  loading: "Comparing locally…",
  empty: "Paste a JSON array or a Horizon trades page with _embedded.records. Include both asset identities, amounts, base_is_seller, and price { n, d } for each row.",
  errors: {
    invalid_input: "Paste at least one trade; never paste a secret seed.",
    malformed_data: "The JSON or trade data is malformed. Check decimal amounts, identifiers and asset fields.",
    unsupported_variant: "Use Horizon trade records with native or issued base/counter assets.",
    too_large: "Limit input to 100 rows and 256,000 characters."
  } satisfies Record<InspectorErrorCode, string>,
  caveat: "A matching bound shows compatibility, not proof: Horizon price is the original offer price and fills can round to stroops. A missing price or zero quantity stays incomplete."
};
