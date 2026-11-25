/**
 * Missing evidence: an envelope whose memo is absent (memo none) versus one
 * with a memo, to exercise the "empty vs present" boundary without any network
 * or signature dependency.
 */
import { Account, Asset, Keypair, Memo, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

const sourceKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 5));
const sourceAccountId = sourceKeypair.publicKey();
const destKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 6));
const destAccountId = destKeypair.publicKey();

function build(memo: Memo | undefined) {
  const account = new Account(sourceAccountId, "1");
  let builder = new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET });
  if (memo) {
    builder = builder.addMemo(memo);
  }
  return builder
    .addOperation(Operation.payment({ destination: destAccountId, asset: Asset.native(), amount: "1" }))
    .setTimeout(0)
    .build();
}

/** An envelope with no memo. */
export const noMemoEnvelope = build(undefined).toXDR();

/** An envelope with a text memo. */
export const textMemoEnvelope = build(Memo.text("hello")).toXDR();
