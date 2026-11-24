import type { Rational, RowVerdict } from "@/app/tools/trade-price-rational-inspector/types";
export interface Comparison { verdict: RowVerdict; difference: bigint; bound: bigint }
/** Compare counter/base to normalized offer price. One stroop of rounding in either quantity gives |C*d-B*n| <= d+n. */
export function comparePrice(base: bigint, counter: bigint, price: Rational): Comparison {
  const difference = counter * price.d - base * price.n;
  const magnitude = difference < 0n ? -difference : difference;
  const bound = price.n + price.d;
  return { verdict: magnitude === 0n ? "exact" : magnitude <= bound ? "within_rounding" : "outside_rounding", difference, bound };
}
