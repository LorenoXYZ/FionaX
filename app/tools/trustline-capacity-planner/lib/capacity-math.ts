/**
 * Exact receiving-headroom arithmetic on Stellar amounts.
 *
 * Stellar amounts are signed 64-bit stroops rendered as seven-decimal-place
 * strings. This module converts to BigInt stroops, computes
 * `limit - balance - buyingLiabilities`, and renders the result back to a
 * seven-decimal string — never routing through `Number`, which would silently
 * corrupt values beyond `Number.MAX_SAFE_INTEGER`.
 */

const SCALE = 7n;
const DECIMAL_AMOUNT = /^-?\d+(\.\d+)?$/;

function toStroops(amount: string): bigint {
  const negative = amount.startsWith("-");
  const unsigned = negative ? amount.slice(1) : amount;
  const [whole, fraction = ""] = unsigned.split(".");
  const fracPadded = fraction.padEnd(7, "0").slice(0, 7);
  const value = BigInt(whole) * 10n ** SCALE + BigInt(fracPadded);
  return negative ? -value : value;
}

function fromStroops(stroops: bigint): string {
  const negative = stroops < 0n;
  const abs = negative ? -stroops : stroops;
  const whole = abs / 10n ** SCALE;
  const fraction = abs % 10n ** SCALE;
  const frac = fraction.toString().padStart(7, "0");
  return `${negative ? "-" : ""}${whole.toString()}.${frac}`;
}

export interface CapacityInput {
  limit: string;
  balance: string;
  buyingLiabilities: string;
}

/**
 * Computes the exact receiving capacity: `limit - balance - buyingLiabilities`.
 * A negative result means the trustline currently owes more than it can hold.
 */
export function computeReceivingCapacity(input: CapacityInput): string {
  for (const [name, value] of [
    ["limit", input.limit],
    ["balance", input.balance],
    ["buyingLiabilities", input.buyingLiabilities]
  ] as const) {
    if (!DECIMAL_AMOUNT.test(value)) {
      throw new Error(`Not a decimal amount: ${name} = "${value}"`);
    }
  }

  const limit = toStroops(input.limit);
  const balance = toStroops(input.balance);
  const buying = toStroops(input.buyingLiabilities);

  return fromStroops(limit - balance - buying);
}
