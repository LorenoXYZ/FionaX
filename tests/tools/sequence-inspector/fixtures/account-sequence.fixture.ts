import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import type { SequenceInspectorDeps } from "@/app/tools/sequence-inspector/lib/sequenceInspector";
import type { SequenceAccountLoader } from "@/app/tools/sequence-inspector/lib/sequence-fetch";

export const accountId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 2)).publicKey();

/** A realistic, mid-range sequence number — well within Number.MAX_SAFE_INTEGER on its own, but exercised end to end through BigInt regardless. */
export const currentSequence = "410911031242866178";
export const expectedNextSequence = "410911031242866179";

export const accountSequenceLoader: SequenceAccountLoader = {
  async loadAccount() {
    return { sequence: currentSequence };
  }
};

export const accountSequenceDeps: SequenceInspectorDeps = {
  async loadSequence() {
    return currentSequence;
  }
};
