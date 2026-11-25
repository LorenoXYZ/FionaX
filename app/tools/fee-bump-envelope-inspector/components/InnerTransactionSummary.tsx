import type { InspectorResult } from "../types";
export function InnerTransactionSummary({ result }: { result: InspectorResult }) {
  return <section className="space-y-2 rounded-lg border p-4"><h3 className="font-bold">Inner transaction</h3>
    <p>Source: <code className="break-all">{result.innerSource}</code></p><p>Sequence: <code>{result.innerSequence}</code></p>
    <p>Inner transaction hash: <code className="break-all">{result.innerHash}</code></p>
    <h4 className="font-semibold">Operations ({result.operations.length})</h4>
    {result.operations.length ? <ol className="list-inside list-decimal">{result.operations.map((op) => <li key={op.index}><code>{op.type}</code> — source <code className="break-all">{op.source}</code></li>)}</ol> : <p>No operations encoded.</p>}
  </section>;
}
