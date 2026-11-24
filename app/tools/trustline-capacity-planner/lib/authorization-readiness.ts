import type {
  AuthorizationState,
  TrustlineRecord
} from "@/app/tools/trustline-capacity-planner/types";

/**
 * Derives the receiving authorization state from a trustline record.
 *
 * Stellar distinguishes three states for an issued asset:
 *   - `is_authorized` — the issuer fully authorizes both sending and receiving.
 *   - `is_authorized_to_maintain_liabilities` — the account may keep existing
 *     balances and pay down liabilities, but may not receive new funds.
 *   - neither flag — the trustline is fully unauthorized.
 *
 * Receiving capacity only matters when fully authorized; a
 * maintain-liabilities-only or unauthorized trustline cannot receive new
 * funds regardless of the numeric headroom, so the two concerns are kept
 * distinct rather than folded into the number.
 */
export function resolveAuthorization(record: TrustlineRecord): AuthorizationState {
  if (record.isAuthorized) {
    return "authorized";
  }
  if (record.isAuthorizedToMaintainLiabilities) {
    return "authorized_to_maintain_liabilities";
  }
  return "unauthorized";
}
