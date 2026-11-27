import { stroopsToXlm } from "../lib/format";
import type { InspectorResult } from "../types";
export function FeePayerSummary({ result }: { result: InspectorResult }) {
  return <section className="space-y-2 rounded-lg border p-4"><h3 className="font-bold">Outer fee-bump layer</h3>
    <p>Fee payer: <code className="break-all">{result.feeSource}</code></p>
    <p>Exact fee: <code>{result.feeStroops} stroops</code> ({stroopsToXlm(result.feeStroops)})</p>
    <p>Outer transaction hash: <code className="break-all">{result.outerHash}</code></p></section>;
}
