const DECIMAL_INTEGER = /^-?\d+$/;

/**
 * The next valid sequence number for a new transaction from this account:
 * exactly `currentSequence + 1` (the Stellar protocol rejects any other
 * value). Uses `BigInt` exclusively — never `Number` — since a sequence
 * number is a 64-bit integer that can exceed
 * `Number.MAX_SAFE_INTEGER` (2^53 - 1).
 */
export function computeNextSequence(currentSequence: string): string {
  if (!DECIMAL_INTEGER.test(currentSequence)) {
    throw new Error(`Not a decimal integer string: ${currentSequence}`);
  }

  return (BigInt(currentSequence) + BigInt(1)).toString();
}
