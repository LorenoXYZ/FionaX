import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";

export const incompleteIssuerId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 7)).publicKey();

/**
 * A valid trustline record that omits buying/selling liabilities entirely.
 * The planner must mark this as incomplete evidence rather than treating
 * liabilities as zero.
 */
export const missingLiabilitiesRecord = {
  balance: "12.0000000",
  limit: "100.0000000",
  is_authorized: true,
  is_authorized_to_maintain_liabilities: false,
  asset_type: "credit_alphanum4",
  asset_code: "USDC",
  asset_issuer: incompleteIssuerId
};
