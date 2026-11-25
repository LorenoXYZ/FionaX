import { StatusMessage } from "@/components/ui/StatusMessage";
import type { InspectorResult } from "../types";
import { copy } from "../copy";
import { FeePayerSummary } from "./FeePayerSummary";
import { InnerTransactionSummary } from "./InnerTransactionSummary";
import { SignatureLayerRows } from "./SignatureLayerRows";
export function FeeBumpEnvelopeInspectorResult({ result }: { result: InspectorResult }) {
  return <div className="space-y-4 text-sm"><h2 className="font-extrabold">Decoded envelope</h2>
    <p>Network passphrase used: <code className="break-all">{result.networkPassphrase}</code></p>
    {result.evidence === "incomplete" && <StatusMessage type="warning" title="Incomplete signature evidence" description={copy.incomplete} />}
    <FeePayerSummary result={result} /><InnerTransactionSummary result={result} /><SignatureLayerRows result={result} />
    <p className="text-[#68758a]">{copy.caveat}</p></div>;
}
