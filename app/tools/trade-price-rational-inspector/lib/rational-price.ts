import type { Rational } from "@/app/tools/trade-price-rational-inspector/types";
import { TradeDecodeError } from "@/app/tools/trade-price-rational-inspector/lib/tradePriceRationalInspector.errors";
const MAX_PRICE = 9_223_372_036_854_775_807n;
function parsePart(value: unknown): bigint {
  if ((typeof value !== "number" || !Number.isSafeInteger(value)) && (typeof value !== "string" || !/^[0-9]+$/.test(value))) throw new TradeDecodeError("malformed_data", "Price numerator and denominator must be exact integers.");
  const part = BigInt(value);
  if (part <= 0n || part > MAX_PRICE) throw new TradeDecodeError("malformed_data", "Price numerator and denominator must be positive signed 64-bit integers.");
  return part;
}
export function parsePrice(raw: unknown): Rational {
  if (!raw || typeof raw !== "object" || Array.isArray(raw) || !("n" in raw) || !("d" in raw)) throw new TradeDecodeError("malformed_data", "Price must contain n and d.");
  if (Object.keys(raw).some((key) => key !== "n" && key !== "d")) throw new TradeDecodeError("unsupported_variant", "Unknown rational price fields.");
  return { n: parsePart(raw.n), d: parsePart(raw.d) };
}
export function reciprocal(price: Rational): Rational { return { n: price.d, d: price.n }; }
/** Horizon trade price is counter per base regardless of which side sold. */
export function normalizedPrice(price: Rational): Rational { return price; }
/** When the base side sold counter, the seller's bought-per-sold quote is the reciprocal. */
export function sellerPerspectivePrice(price: Rational, baseIsSeller: boolean): Rational { return baseIsSeller ? price : reciprocal(price); }
