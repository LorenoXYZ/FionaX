import type { FeeBumpTransaction } from "@stellar/stellar-sdk";
export function networkHashes(transaction: FeeBumpTransaction) {
  return { outerHash: transaction.hash().toString("hex"), innerHash: transaction.innerTransaction.hash().toString("hex") };
}
