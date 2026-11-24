import type { InspectedRow } from "@/app/tools/trade-price-rational-inspector/types";
export function TradeDataGaps({ rows }: { rows: InspectedRow[] }) {
  const gaps = rows.filter((row) => row.verdict === "incomplete" || row.verdict === "malformed");
  if (!gaps.length) return null;
  return <aside aria-label="Evidence gaps" className="rounded-md bg-amber-50 p-3 text-sm"><strong>Evidence gaps</strong><p>{gaps.length} row(s) cannot support a price assertion. Review each row below.</p></aside>;
}
