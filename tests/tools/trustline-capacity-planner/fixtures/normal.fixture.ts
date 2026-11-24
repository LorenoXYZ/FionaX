import { Keypair } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import type { TrustlineCapacityInput } from "@/app/tools/trustline-capacity-planner/types";

export const accountId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 3)).publicKey();
export const issuerId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 4)).publicKey();

/** A deterministic, protocol-correct, fully-authorized USDC trustline. */
export const normalRecord = {
  balance: "12.0000000",
  limit: "100.0000000",
  buying_liabilities: "3.5000000",
  selling_liabilities: "0.0000000",
  is_authorized: true,
  is_authorized_to_maintain_liabilities: false,
  asset_type: "credit_alphanum4",
  asset_code: "USDC",
  asset_issuer: issuerId
};

export const normalRawRecord = JSON.stringify(normalRecord);

export const normalInput: TrustlineCapacityInput = {
  accountId,
  assetCode: "USDC",
  issuerId,
  rawRecord: normalRawRecord
};

/** 100 - 12 - 3.5 = 84.5, rendered to seven decimals. */
export const expectedCapacity = "84.5000000";
