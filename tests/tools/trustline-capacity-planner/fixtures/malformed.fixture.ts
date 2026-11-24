import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

export const malformedIssuerId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 6)).publicKey();

/** A native (XLM) entry: no limit or issuer, so it is an unsupported variant. */
export const nativeRecord = {
  balance: "10.0000000",
  buying_liabilities: "0.0000000",
  selling_liabilities: "0.0000000",
  asset_type: "native"
};

/** Not valid JSON at all. */
export const notJson = "{ not json";

/** Valid JSON but an array instead of an object. */
export const arrayRecord = JSON.stringify([
  { balance: "1.0000000", limit: "10.0000000", asset_type: "credit_alphanum4", asset_code: "USDC", asset_issuer: malformedIssuerId }
]);

/** Missing the required `limit` field. */
export const missingLimitRecord = {
  balance: "1.0000000",
  buying_liabilities: "0.0000000",
  selling_liabilities: "0.0000000",
  is_authorized: true,
  asset_type: "credit_alphanum4",
  asset_code: "USDC",
  asset_issuer: malformedIssuerId
};

/** A non-numeric amount string. */
export const malformedAmountRecord = {
  balance: "not-a-number",
  limit: "100.0000000",
  buying_liabilities: "0.0000000",
  selling_liabilities: "0.0000000",
  is_authorized: true,
  asset_type: "credit_alphanum4",
  asset_code: "USDC",
  asset_issuer: malformedIssuerId
};
