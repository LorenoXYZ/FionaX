import { StrKey } from "@stellar/stellar-sdk";
import type { Input, ErrorCode } from "./types";
export function validateInput(claimant: string, network: unknown): { ok: true; input: Input } | { ok: false; error: ErrorCode } {
 const value = claimant.trim();
 if (value.length > 100) return { ok: false, error: "too_large" };
 if (!StrKey.isValidEd25519PublicKey(value) || (network !== "testnet" && network !== "mainnet")) return { ok: false, error: "invalid_input" };
 return { ok: true, input: { claimant: value, network } };
}
