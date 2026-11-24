import type {
  TrustlineCapacityError,
  TrustlineRecord
} from "@/app/tools/trustline-capacity-planner/types";

/**
 * Parses a pasted Horizon balance record into a typed `TrustlineRecord`.
 *
 * A Horizon `balance` entry for an issued asset looks like:
 *   {
 *     "balance": "12.0000000",
 *     "limit": "100.0000000",
 *     "buying_liabilities": "0.0000000",
 *     "selling_liabilities": "0.0000000",
 *     "is_authorized": true,
 *     "is_authorized_to_maintain_liabilities": false,
 *     "asset_type": "credit_alphanum4",
 *     "asset_code": "USDC",
 *     "asset_issuer": "G…"
 *   }
 *
 * Native (XLM) and liquidity-pool-share entries are unsupported variants:
 * they have no limit or issuer, so a "receiving capacity" is meaningless.
 * Missing fields are treated as unknown evidence, never silently as zero —
 * the caller decides how to surface that (see lib/trustlineCapacityPlanner.ts).
 */

const DECIMAL_AMOUNT = /^-?\d+(\.\d+)?$/;

export interface TrustlineRecordParse {
  ok: true;
  record: TrustlineRecord;
  /** True when the record omitted buying/selling liabilities entirely. */
  liabilitiesMissing: boolean;
}

export function parseTrustlineRecord(
  raw: string
): TrustlineRecordParse | { ok: false; error: TrustlineCapacityError } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      error: { code: "malformed_data", message: "The pasted text is not valid JSON. Paste a single Horizon balance entry." }
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      ok: false,
      error: { code: "malformed_data", message: "Paste a single balance object, not an array." }
    };
  }

  const record = parsed as Record<string, unknown>;
  const assetType = typeof record.asset_type === "string" ? record.asset_type : "";

  if (assetType !== "credit_alphanum4" && assetType !== "credit_alphanum12") {
    return {
      ok: false,
      error: {
        code: "unsupported_variant",
        message: "This record is not an issued-asset trustline. Only credit_alphanum4 and credit_alphanum12 are supported."
      }
    };
  }

  if (typeof record.asset_code !== "string" || record.asset_code.length === 0) {
    return {
      ok: false,
      error: { code: "malformed_data", message: "The record has no asset_code." }
    };
  }

  if (typeof record.asset_issuer !== "string" || record.asset_issuer.length === 0) {
    return {
      ok: false,
      error: { code: "malformed_data", message: "The record has no asset_issuer." }
    };
  }

  for (const field of ["balance", "limit"] as const) {
    const value = record[field];
    if (typeof value !== "string" || !DECIMAL_AMOUNT.test(value)) {
      return {
        ok: false,
        error: { code: "malformed_data", message: `The record's ${field} is missing or not a valid amount.` }
      };
    }
  }

  const buying = record.buying_liabilities;
  const selling = record.selling_liabilities;
  const liabilitiesMissing = buying === undefined || selling === undefined;

  for (const [name, value] of [
    ["buying_liabilities", buying],
    ["selling_liabilities", selling]
  ] as const) {
    if (value !== undefined && (typeof value !== "string" || !DECIMAL_AMOUNT.test(value))) {
      return {
        ok: false,
        error: { code: "malformed_data", message: `The record's ${name} is not a valid amount.` }
      };
    }
  }

  return {
    ok: true,
    liabilitiesMissing,
    record: {
      assetType,
      assetCode: record.asset_code,
      assetIssuer: record.asset_issuer,
      balance: record.balance as string,
      limit: record.limit as string,
      buyingLiabilities: typeof buying === "string" ? buying : undefined,
      sellingLiabilities: typeof selling === "string" ? selling : undefined,
      isAuthorized: record.is_authorized === true,
      isAuthorizedToMaintainLiabilities: record.is_authorized_to_maintain_liabilities === true
    }
  };
}
