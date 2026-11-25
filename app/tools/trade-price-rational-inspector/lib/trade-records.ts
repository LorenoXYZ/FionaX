import { Asset, StrKey } from "@stellar/stellar-sdk";
import type { AssetIdentity, TradeRecord } from "@/app/tools/trade-price-rational-inspector/types";
import { TradeDecodeError } from "@/app/tools/trade-price-rational-inspector/lib/tradePriceRationalInspector.errors";
import { parsePrice } from "@/app/tools/trade-price-rational-inspector/lib/rational-price";
const MAX_STROOPS = 9_223_372_036_854_775_807n;
const amountPattern = /^(?:0|[1-9]\d*)(?:\.(\d{1,7}))?$/;
const idPattern = /^\d{1,19}-\d{1,10}$/;
export function parseAmount(raw: unknown): bigint {
  if (typeof raw !== "string") throw new TradeDecodeError("malformed_data", "Amounts must be decimal strings.");
  if (!amountPattern.test(raw)) throw new TradeDecodeError("malformed_data", "Amount must have at most seven decimal places and no sign or exponent.");
  const [whole, fraction = ""] = raw.split(".");
  const stroops = BigInt(whole) * 10_000_000n + BigInt(fraction.padEnd(7, "0") || "0");
  if (stroops > MAX_STROOPS) throw new TradeDecodeError("too_large", "Amount exceeds Stellar's signed 64-bit stroop limit.");
  return stroops;
}
export function parseAsset(row: Record<string, unknown>, side: "base" | "counter"): AssetIdentity {
  const type = row[`${side}_asset_type`];
  if (type === "native") {
    if (row[`${side}_asset_code`] !== undefined || row[`${side}_asset_issuer`] !== undefined) throw new TradeDecodeError("malformed_data", "Native assets cannot have a code or issuer.");
    return { type };
  }
  if (type !== "credit_alphanum4" && type !== "credit_alphanum12") throw new TradeDecodeError("unsupported_variant", "Only native and credit_alphanum4/12 assets are supported.");
  const code = row[`${side}_asset_code`];
  const issuer = row[`${side}_asset_issuer`];
  const limit = type === "credit_alphanum4" ? 4 : 12;
  if (typeof code !== "string" || !new RegExp(`^[a-zA-Z0-9]{1,${limit}}$`).test(code) || (type === "credit_alphanum12" && code.length <= 4) ||
      typeof issuer !== "string" || !StrKey.isValidEd25519PublicKey(issuer)) throw new TradeDecodeError("malformed_data", `Incomplete or invalid ${side} asset identity.`);
  try { new Asset(code, issuer); } catch { throw new TradeDecodeError("malformed_data", `Invalid ${side} asset.`); }
  return { type, code, issuer };
}
export function parseTradeRecord(raw: unknown): TradeRecord {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new TradeDecodeError("malformed_data", "Trade row must be an object.");
  const row = raw as Record<string, unknown>;
  if (row.trade_type !== undefined && row.trade_type !== "orderbook") throw new TradeDecodeError("unsupported_variant", "Only orderbook trade prices are supported; liquidity pool trades need a different price model.");
  if (typeof row.id !== "string" || !idPattern.test(row.id) || BigInt(row.id.split("-")[0]) > MAX_STROOPS) throw new TradeDecodeError("malformed_data", "Trade id must be a lossless operation-id and index string.");
  if (typeof row.base_is_seller !== "boolean") throw new TradeDecodeError("malformed_data", "base_is_seller must be true or false.");
  const base = parseAsset(row, "base");
  const counter = parseAsset(row, "counter");
  const account = (side: "base" | "counter"): string | undefined => {
    const value = row[`${side}_account`];
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string" || !StrKey.isValidEd25519PublicKey(value)) throw new TradeDecodeError("malformed_data", `Invalid ${side} account identity.`);
    return value;
  };
  if (base.type === counter.type && base.code === counter.code && base.issuer === counter.issuer) throw new TradeDecodeError("malformed_data", "Base and counter must be distinct assets.");
  return { id: row.id, base, counter, baseAccount: account("base"), counterAccount: account("counter"), baseAmount: parseAmount(row.base_amount), counterAmount: parseAmount(row.counter_amount), baseIsSeller: row.base_is_seller, price: row.price === undefined || row.price === null ? undefined : parsePrice(row.price) };
}
