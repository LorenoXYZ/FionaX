import type { InspectorResult, SignatureInfo } from "../types";
function Layer({ title, purpose, signatures }: { title: string; purpose: string; signatures: SignatureInfo[] }) {
  return <section className="space-y-2 rounded-lg border p-4"><h3 className="font-bold">{title} ({signatures.length})</h3><p>{purpose}</p>
    {signatures.length ? <ol className="list-inside list-decimal">{signatures.map((item, index) => <li className="break-all" key={index}>Hint <code>{item.hint}</code>; signature <code>{item.signature}</code></li>)}</ol> : <p>No signatures in this layer.</p>}
  </section>;
}
export function SignatureLayerRows({ result }: { result: InspectorResult }) {
  return <div className="space-y-3"><Layer title="Inner signatures" purpose="Authorize the inner transaction payload and its operations." signatures={result.innerSignatures} />
    <Layer title="Outer signatures" purpose="Authorize the fee-bump payload, including the fee payer, fee, and wrapped inner transaction." signatures={result.outerSignatures} /></div>;
}
