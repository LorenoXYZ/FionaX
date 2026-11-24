import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

export const boundaryIssuerId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 5)).publicKey();

/** Zero headroom: limit equals balance plus buying liabilities. */
export const zeroHeadroomRecord = {
  balance: "50.0000000",
  limit: "50.0000000",
  buying_liabilities: "0.0000000",
  selling_liabilities: "0.0000000",
  is_authorized: true,
  is_authorized_to_maintain_liabilities: false,
  asset_type: "credit_alphanum4",
  asset_code: "USDC",
  asset_issuer: boundaryIssuerId
};

/** Negative result: liabilities push the balance past the limit. */
export const negativeHeadroomRecord = {
  balance: "90.0000000",
  limit: "100.0000000",
  buying_liabilities: "25.0000000",
  selling_liabilities: "0.0000000",
  is_authorized: true,
  is_authorized_to_maintain_liabilities: false,
  asset_type: "credit_alphanum4",
  asset_code: "USDC",
  asset_issuer: boundaryIssuerId
};

/**
 * A 64-bit-scale amount beyond Number.MAX_SAFE_INTEGER, to prove the pipeline
 * never loses precision through `Number`.
 */
export const largeAmountRecord = {
  balance: "10000000000.0000000",
  limit: "9223372036854.7758070",
  buying_liabilities: "0.0000000",
  selling_liabilities: "0.0000000",
  is_authorized: true,
  is_authorized_to_maintain_liabilities: false,
  asset_type: "credit_alphanum12",
  asset_code: "HUGEASSET",
  asset_issuer: boundaryIssuerId
};

/** limit − balance = 9223372036854.7758070 − 10000000000.0000000 */
export const largeExpectedCapacity = "9213372036854.7758070";
