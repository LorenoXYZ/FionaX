import { StrKey } from "@stellar/stellar-sdk";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import { InspectorFailure, type InspectorInput } from "./types";
export function validateInput(raw: string, network: StellarNetwork): InspectorInput {
  const accountId = raw.trim();
  if (raw.length > 128) throw new InspectorFailure("too_large", "Account input exceeds 128 characters.");
  if (network !== "testnet" && network !== "mainnet") throw new InspectorFailure("unsupported_variant", "Choose testnet or mainnet.");
  if (!StrKey.isValidEd25519PublicKey(accountId)) throw new InspectorFailure("invalid_input", "Enter a valid public G… account ID; secret seeds are rejected.");
  return { accountId, network };
}
