/**
 * Presentation-only helpers. Keep formatting out of components and domain
 * logic — components and `lib/signerQuorumSimulator.ts` never format a signer
 * key or weight directly, only through this module.
 */

/** Shorten a signer key for display without changing the stored value. */
export function formatSignerKey(key: string): string {
  if (key.length <= 16) {
    return key;
  }
  return `${key.slice(0, 8)}…${key.slice(-6)}`;
}

/** Render a signer weight as text; a missing weight becomes an explicit marker. */
export function formatWeight(weight: number | null): string {
  if (weight === null) {
    return "unknown";
  }
  return String(weight);
}

/** Render a threshold as text; a missing threshold becomes an explicit marker. */
export function formatThreshold(threshold: number | null): string {
  if (threshold === null) {
    return "unknown";
  }
  return String(threshold);
}

/** A human label for a signer type. */
export function formatSignerType(type: string): string {
  switch (type) {
    case "ed25519":
      return "ed25519 public key";
    case "preauth_tx":
      return "pre-authorized transaction";
    case "sha256_hash":
      return "sha256 hash (x)";
    default:
      return type;
  }
}
