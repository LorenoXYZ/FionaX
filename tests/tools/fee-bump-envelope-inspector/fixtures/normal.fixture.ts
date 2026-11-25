import { Account, Keypair, MuxedAccount, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
export const passphrase = Networks.TESTNET;
export const innerKey = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 1));
export const feeKey = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 2));
export function makeEnvelope(options: { muxed?: boolean; innerSigned?: boolean; outerSigned?: boolean; sequence?: string; fee?: string } = {}) {
  const source = new Account(innerKey.publicKey(), options.sequence ?? "100");
  const inner = new TransactionBuilder(source, { fee: "100", networkPassphrase: passphrase })
    .addOperation(Operation.manageData({ name: "hello", value: "world" })).setTimeout(0).build();
  if (options.innerSigned !== false) inner.sign(innerKey);
  const payer = options.muxed ? new MuxedAccount(new Account(feeKey.publicKey(), "0"), "18446744073709551615").accountId() : feeKey.publicKey();
  const outer = TransactionBuilder.buildFeeBumpTransaction(payer, options.fee ?? "100", inner, passphrase);
  if (options.outerSigned !== false) outer.sign(feeKey);
  return { envelope: outer.toXDR(), outer, inner, payer };
}
