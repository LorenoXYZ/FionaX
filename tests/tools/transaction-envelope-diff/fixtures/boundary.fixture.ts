import { Account, Asset, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

const sourceKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 3));
const sourceAccountId = sourceKeypair.publicKey();
const destKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 4));
const destAccountId = destKeypair.publicKey();

function buildWithOps(ops: ReturnType<typeof Operation.payment>[], seq: string) {
  const account = new Account(sourceAccountId, seq);
  let builder = new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET });
  for (const op of ops) {
    builder = builder.addOperation(op);
  }
  return builder.setTimeout(0).build();
}

const payment = (amount: string) =>
  Operation.payment({ destination: destAccountId, asset: Asset.native(), amount });

/** An envelope with two operations. */
export const twoOpEnvelope = buildWithOps([payment("1"), payment("2")], "1").toXDR();

/** The same two operations in reversed order. */
export const reorderedEnvelope = buildWithOps([payment("2"), payment("1")], "1").toXDR();

/** A single-operation envelope with a large sequence number. */
export const largeSeqEnvelope = buildWithOps([payment("1")], "9223372036854775807").toXDR();
