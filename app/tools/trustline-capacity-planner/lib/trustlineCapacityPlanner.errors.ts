import type { TrustlineCapacityError } from "@/app/tools/trustline-capacity-planner/types";

/**
 * Maps an unexpected thrown value into a typed tool error. Domain modules
 * return structured `{ ok: false, error }` outcomes for expected failures;
 * this is the catch-all for anything that slipped through as a throw.
 */
export function toToolError(error: unknown): TrustlineCapacityError {
  if (error instanceof Error && error.message.length > 0) {
    return { code: "malformed_data", message: error.message };
  }
  return { code: "malformed_data", message: "The record could not be read." };
}
