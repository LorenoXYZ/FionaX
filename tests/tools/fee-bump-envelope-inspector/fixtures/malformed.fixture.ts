import { Account, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
export const malformedBase64 = "***";
export function ordinaryEnvelope() {
  const key = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 3));
  return new TransactionBuilder(new Account(key.publicKey(), "1"), { fee: "100", networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.manageData({ name: "x", value: "y" })).setTimeout(0).build().toXDR();
}
