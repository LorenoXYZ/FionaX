import { encodeMuxedAccountToAddress, type xdr } from "@stellar/stellar-sdk";
import type { OperationInfo } from "../types";
export function summarizeFeeAndOperations(raw: xdr.FeeBumpTransactionEnvelope, innerSource: string): { feeStroops: string; operations: OperationInfo[] } {
  const feeStroops = raw.tx().fee().toString();
  const operations = raw.tx().innerTx().v1().tx().operations().map((op, index) => ({
    index: index + 1, type: op.body().switch().name, source: op.sourceAccount() ? encodeMuxedAccountToAddress(op.sourceAccount()!, true) : innerSource
  }));
  return { feeStroops, operations };
}
