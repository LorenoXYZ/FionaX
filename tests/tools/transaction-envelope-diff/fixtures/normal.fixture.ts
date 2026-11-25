import { Account, Asset, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

const sourceKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 1));
const sourceAccountId = sourceKeypair.publicKey();
const destKeypair = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 2));
const destAccountId = destKeypair.publicKey();

function build(amount: string, seq: string) {
  const account = new Account(sourceAccountId, seq);
  return new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.payment({ destination: destAccountId, asset: Asset.native(), amount }))
    .setTimeout(0)
    .build();
}

/** A baseline envelope paying 1 XLM at sequence 1. */
export const baseEnvelope = build("1", "1").toXDR();

/** A modified envelope paying 2 XLM at the same sequence. */
export const changedAmountEnvelope = build("2", "1").toXDR();

/** An envelope identical in payload but at a later sequence. */
export const changedSeqEnvelope = build("1", "2").toXDR();
