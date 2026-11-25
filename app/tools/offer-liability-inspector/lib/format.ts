import { InspectorFailure, type Asset } from "../types";
import { StrKey } from "@stellar/stellar-sdk";
const MAX = 9223372036854775807n;
export function amountToStroops(value: unknown): bigint {
  if (typeof value !== "string" || !/^(0|[1-9]\d{0,11})(\.\d{1,7})?$/.test(value)) throw new InspectorFailure("malformed_data", "Invalid Stellar amount.");
  const [whole, fraction = ""] = value.split(".");
  const units = BigInt(whole) * 10000000n + BigInt(fraction.padEnd(7, "0") || "0");
  if (units > MAX) throw new InspectorFailure("too_large", "Amount exceeds Stellar's signed 64-bit limit.");
  return units;
}
export function formatAmount(units: bigint): string {
  const sign = units < 0n ? "-" : "";
  const abs = units < 0n ? -units : units;
  return `${sign}${abs / 10000000n}.${(abs % 10000000n).toString().padStart(7, "0")}`;
}
export function assetFromWire(value: unknown): Asset {
  if (!value || typeof value !== "object") throw new InspectorFailure("malformed_data", "Missing asset identity.");
  const v = value as Record<string, unknown>;
  if (v.asset_type === "native") return { key: "native", label: "XLM" };
  if (v.asset_type !== "credit_alphanum4" && v.asset_type !== "credit_alphanum12") throw new InspectorFailure("unsupported_variant", "Unsupported asset type.");
  const max = v.asset_type === "credit_alphanum4" ? 4 : 12;
  if (typeof v.asset_code !== "string" || !new RegExp(`^[a-zA-Z0-9]{1,${max}}$`).test(v.asset_code) || typeof v.asset_issuer !== "string" || !StrKey.isValidEd25519PublicKey(v.asset_issuer)) throw new InspectorFailure("malformed_data", "Invalid issued asset identity.");
  return { key: `${v.asset_type}:${v.asset_code}:${v.asset_issuer}`, label: `${v.asset_code}:${v.asset_issuer}` };
}
export function parseRatio(value: unknown): { n: bigint; d: bigint } {
  if (!value || typeof value !== "object") throw new InspectorFailure("malformed_data", "Missing exact offer price ratio.");
  const { n, d } = value as Record<string, unknown>;
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || (n as number) < 1 || (d as number) < 1 || (n as number) > 2147483647 || (d as number) > 2147483647) throw new InspectorFailure("malformed_data", "Invalid offer price ratio.");
  return { n: BigInt(n as number), d: BigInt(d as number) };
}
