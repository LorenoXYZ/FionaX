import { parseTrustlineRecord } from "@/app/tools/trustline-capacity-planner/lib/trustline-record";
import { computeReceivingCapacity } from "@/app/tools/trustline-capacity-planner/lib/capacity-math";
import { resolveAuthorization } from "@/app/tools/trustline-capacity-planner/lib/authorization-readiness";
import type {
  TrustlineCapacityError,
  TrustlineCapacityInput,
  TrustlineCapacityResult
} from "@/app/tools/trustline-capacity-planner/types";

export type TrustlineCapacityOutcome =
  | { ok: true; result: TrustlineCapacityResult }
  | { ok: false; error: TrustlineCapacityError };

/**
 * Composes this issue's domain modules into a single outcome.
 *
 * This tool is fully offline: it never makes a request, and never signs or
 * submits anything. The account/asset/issuer identifiers the user enters are
 * validated for shape and then bound to the result as provenance; the pasted
 * record is parsed and its arithmetic is done in exact BigInt stroops.
 */
export function runTrustlineCapacityPlanner(
  input: TrustlineCapacityInput
): TrustlineCapacityOutcome {
  const parsed = parseTrustlineRecord(input.rawRecord);
  if (!parsed.ok) {
    return parsed;
  }

  const { record, liabilitiesMissing } = parsed;

  // Bind the record to the explicit identifiers the user selected. A record
  // that disagrees with the declared asset/issuer is evidence of a wrong
  // paste, not a different trustline to silently accept.
  if (record.assetCode.toUpperCase() !== input.assetCode.toUpperCase()) {
    return {
      ok: false,
      error: {
        code: "malformed_data",
        message: `The pasted record is for asset ${record.assetCode}, but you selected ${input.assetCode}.`
      }
    };
  }

  if (record.assetIssuer !== input.issuerId) {
    return {
      ok: false,
      error: {
        code: "malformed_data",
        message: "The pasted record's issuer does not match the issuer you selected."
      }
    };
  }

  const buyingLiabilities = record.buyingLiabilities ?? "0.0000000";
  const receivingCapacity = computeReceivingCapacity({
    limit: record.limit,
    balance: record.balance,
    buyingLiabilities
  });

  return {
    ok: true,
    result: {
      accountId: input.accountId,
      assetCode: record.assetCode,
      issuerId: record.assetIssuer,
      receivingCapacity,
      limit: record.limit,
      balance: record.balance,
      buyingLiabilities,
      authorization: resolveAuthorization(record),
      liabilitiesIncomplete: liabilitiesMissing
    }
  };
}
