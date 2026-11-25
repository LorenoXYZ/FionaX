import type { InspectorResult } from "@/app/tools/trade-price-rational-inspector/types";
import { copy } from "@/app/tools/trade-price-rational-inspector/copy";
import { TradePriceRows } from "@/app/tools/trade-price-rational-inspector/components/TradePriceRows";
import { TradeDataGaps } from "@/app/tools/trade-price-rational-inspector/components/TradeDataGaps";
export function TradePriceRationalInspectorResult({ result }: { result: InspectorResult }) {
  return <section aria-label="Inspection result" className="space-y-4">
    <h2 className="font-bold">Inspection results</h2>
    <p role="status" className="text-sm">{result.rows.length} rows from {result.source === "array" ? "pasted array" : "Horizon page"}; {result.compared} compared, {result.incomplete} incomplete, {result.malformed} malformed.</p>
    <p className="text-sm text-[#68758a]">{copy.caveat}</p>
    <TradeDataGaps rows={result.rows} />
    <TradePriceRows rows={result.rows} />
  </section>;
}
