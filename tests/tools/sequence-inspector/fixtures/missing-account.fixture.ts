import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import type { SequenceInspectorDeps } from "@/app/tools/sequence-inspector/lib/sequenceInspector";
import type { SequenceAccountLoader } from "@/app/tools/sequence-inspector/lib/sequence-fetch";

export const missingAccountId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 4)).publicKey();

/** Shape of the error Horizon's SDK client throws for a 404 response. */
function notFoundError(): Error & { response: { status: number } } {
  const error = new Error("Not Found") as Error & { response: { status: number } };
  error.response = { status: 404 };
  return error;
}

export const missingAccountLoader: SequenceAccountLoader = {
  async loadAccount() {
    throw notFoundError();
  }
};

export const missingAccountDeps: SequenceInspectorDeps = {
  async loadSequence() {
    throw notFoundError();
  }
};
