import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

/** Public key from a fixed 32-byte test seed. The StrKey secret is never stored. */
export function publicKeyFromFixedSeed(fill: number): string {
  return Keypair.fromRawEd25519Seed(Buffer.alloc(32, fill)).publicKey();
}

export const mixedBatchKeys = {
  alpha: publicKeyFromFixedSeed(1),
  beta: publicKeyFromFixedSeed(2)
};

const malformedPublicKey = `G${"A".repeat(55)}`;

export const mixedBatchRaw = [
  mixedBatchKeys.alpha,
  "not-a-stellar-address",
  malformedPublicKey,
  mixedBatchKeys.beta
].join("\n");

export const mixedBatchMalformed = malformedPublicKey;
