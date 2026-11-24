import type { InspectorInput, InspectorResult, InspectedRow } from "@/app/tools/trade-price-rational-inspector/types";
import { parseTradeRecord } from "@/app/tools/trade-price-rational-inspector/lib/trade-records";
import { normalizedPrice, sellerPerspectivePrice } from "@/app/tools/trade-price-rational-inspector/lib/rational-price";
import { comparePrice } from "@/app/tools/trade-price-rational-inspector/lib/price-consistency";
import { toToolError } from "@/app/tools/trade-price-rational-inspector/lib/tradePriceRationalInspector.errors";
export function runTradePriceRationalInspector(input: InspectorInput): InspectorResult {
  const rows: InspectedRow[] = input.records.map((raw, index) => {
    try {
      const record = parseTradeRecord(raw);
      if (!record.price) return { index, id: record.id, record, verdict: "incomplete", reason: "No rational price in this Horizon row; quantities alone cannot verify an offer price." };
      if (record.baseAmount === 0n || record.counterAmount === 0n) return { index, id: record.id, record, verdict: "incomplete", reason: "Zero quantity makes the implied ratio unavailable." };
      const price = normalizedPrice(record.price);
      const comparison = comparePrice(record.baseAmount, record.counterAmount, price);
      return { index, id: record.id, record, verdict: comparison.verdict, reason: comparison.verdict === "exact" ? "Exact equality." : comparison.verdict === "within_rounding" ? "Difference fits the one-stroop-per-quantity bound; this is compatible, not proof of the offer price." : "Difference exceeds the rounding bound.", normalizedPrice: price, sellerPrice: sellerPerspectivePrice(price, record.baseIsSeller), crossDifference: comparison.difference, crossBound: comparison.bound };
    } catch (error) {
      const mapped = toToolError(error);
      return { index, verdict: "malformed", reason: `${mapped.code}: ${mapped.message}` };
    }
  });
  return { source: input.source, rows, compared: rows.filter((r) => r.verdict === "exact" || r.verdict === "within_rounding" || r.verdict === "outside_rounding").length, incomplete: rows.filter((r) => r.verdict === "incomplete").length, malformed: rows.filter((r) => r.verdict === "malformed").length };
}
