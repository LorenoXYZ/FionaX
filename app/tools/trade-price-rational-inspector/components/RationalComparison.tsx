import type { Rational } from "@/app/tools/trade-price-rational-inspector/types";
import { formatRational } from "@/app/tools/trade-price-rational-inspector/lib/format";
export function RationalComparison({ price, sellerPrice, difference, bound, reversed }: { price: Rational; sellerPrice: Rational; difference: bigint; bound: bigint; reversed: boolean }) {
  return <p className="mt-2 font-mono text-xs">Counter/base price: {formatRational(price)}{reversed ? ` · base seller bought/sold: ${formatRational(sellerPrice)} (reciprocal)` : ""}<br />Cross difference C×d − B×n: {difference.toString()}<br />Allowed absolute bound d+n: {bound.toString()} stroop-weighted units</p>;
}
