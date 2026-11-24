import type { BudgetErrorCode } from "@/app/tools/soroban-resource-budget-explainer/types";

export const copy = {
  title: "Soroban Resource Budget Explainer",
  eyebrow: "Soroban",
  idle: "Explain a recorded simulateTransaction response. No new simulation is requested.",
  loading: "Reading the recorded simulation…",
  empty: "Paste the JSON result. An envelope is optional and its fee stays separate.",
  simulationLabel: "simulateTransaction JSON",
  envelopeLabel: "Optional transaction envelope XDR",
  submit: "Explain budget",
  resultTitle: "Resource budget",
  errors: {
    invalid_input: "Paste the simulation JSON. Fees must be integer strings, and a secret seed is refused.",
    malformed_data: "The JSON, transaction data, or footprint XDR could not be decoded.",
    unsupported_variant: "That envelope type is not explained here.",
    too_large: "Keep each paste under 100,000 characters."
  } satisfies Record<BudgetErrorCode, string>
};
