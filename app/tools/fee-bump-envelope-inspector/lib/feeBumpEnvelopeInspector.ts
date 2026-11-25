import type { InspectorInput, InspectorResult, SignatureInfo } from "../types";
import { validateInput } from "../schema";
import { InspectorFailure } from "./feeBumpEnvelopeInspector.errors";
import { decodeFeeBump } from "./fee-bump-decode";
import { summarizeFeeAndOperations } from "./fee-summary";
import { networkHashes } from "./network-hashes";
function signatures(items: { hint(): Buffer; signature(): Buffer }[]): SignatureInfo[] {
  return items.map((item) => ({ hint: item.hint().toString("hex"), signature: item.signature().toString("base64") }));
}
export function inspectFeeBump(input: InspectorInput): InspectorResult {
  const validated = validateInput(input.envelope, input.passphrase);
  if (!validated.ok) throw new InspectorFailure(validated.error.code);
  const { raw, transaction } = decodeFeeBump(validated.input.envelope, validated.input.passphrase);
  const inner = transaction.innerTransaction;
  const { feeStroops, operations } = summarizeFeeAndOperations(raw, inner.source);
  const innerSignatures = signatures(raw.tx().innerTx().v1().signatures());
  const outerSignatures = signatures(raw.signatures());
  return {
    feeSource: transaction.feeSource, feeStroops, innerSource: inner.source, innerSequence: inner.sequence,
    ...networkHashes(transaction), operations, innerSignatures, outerSignatures,
    networkPassphrase: validated.input.passphrase, evidence: innerSignatures.length && outerSignatures.length ? "complete" : "incomplete"
  };
}
