import type { InspectedRow } from "@/app/tools/trade-price-rational-inspector/types";
import { formatAmount, formatAsset } from "@/app/tools/trade-price-rational-inspector/lib/format";
import { RationalComparison } from "@/app/tools/trade-price-rational-inspector/components/RationalComparison";
export function TradePriceRows({ rows }: { rows: InspectedRow[] }) {
  return <ol className="space-y-3">{rows.map((row) => <li key={row.index} className="rounded-lg border border-[#cfe0ea] p-3 text-sm break-words">
    <h3 className="font-bold">Row {row.index + 1}{row.id ? ` · ${row.id}` : ""} · {row.verdict.replaceAll("_", " ")}</h3>
    <p>{row.reason}</p>
    {row.record && <p>Base: {formatAmount(row.record.baseAmount)} {formatAsset(row.record.base)}<br />Counter: {formatAmount(row.record.counterAmount)} {formatAsset(row.record.counter)}</p>}
    {row.record && (row.record.baseAccount || row.record.counterAccount) && <p>Base account: {row.record.baseAccount ?? "unavailable"}<br />Counter account: {row.record.counterAccount ?? "unavailable"}</p>}
    {row.record && <p>Base side sold {row.record.baseIsSeller ? "base" : "counter"} and bought {row.record.baseIsSeller ? "counter" : "base"}. Reported price: {row.record.price ? `${row.record.price.n}/${row.record.price.d}` : "unavailable"}.</p>}
    {row.normalizedPrice && row.sellerPrice && row.crossDifference !== undefined && row.crossBound !== undefined && <RationalComparison price={row.normalizedPrice} sellerPrice={row.sellerPrice} difference={row.crossDifference} bound={row.crossBound} reversed={!row.record?.baseIsSeller} />}
  </li>)}</ol>;
}
