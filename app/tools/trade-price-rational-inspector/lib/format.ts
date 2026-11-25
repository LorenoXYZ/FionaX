import type { AssetIdentity, Rational } from "@/app/tools/trade-price-rational-inspector/types";
export function formatAmount(stroops: bigint): string {
  const whole = stroops / 10_000_000n;
  const fraction = (stroops % 10_000_000n).toString().padStart(7, "0");
  return `${whole}.${fraction}`;
}
export function formatAsset(asset: AssetIdentity): string { return asset.type === "native" ? "XLM (native)" : `${asset.code} · ${asset.issuer}`; }
export function formatRational(price: Rational): string { return `${price.n}/${price.d}`; }
