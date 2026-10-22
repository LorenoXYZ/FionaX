import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import type { SequenceInspectorDeps } from "@/app/tools/sequence-inspector/lib/sequenceInspector";
import type { SequenceAccountLoader } from "@/app/tools/sequence-inspector/lib/sequence-fetch";

export const highSequenceAccountId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 3)).publicKey();

/**
 * Exceeds Number.MAX_SAFE_INTEGER (9_007_199_254_740_991). Routing this
 * through `Number()` silently rounds it to 9223372036854775000 — the wrong
 * value by 192, and the wrong value for +1 too. Every test using this
 * fixture exists to prove that never happens.
 */
export const highCurrentSequence = "9223372036854774808";
export const expectedHighNextSequence = "9223372036854774809";

export const highSequenceLoader: SequenceAccountLoader = {
  async loadAccount() {
    return { sequence: highCurrentSequence };
  }
};

export const highSequenceDeps: SequenceInspectorDeps = {
  async loadSequence() {
    return highCurrentSequence;
  }
};
