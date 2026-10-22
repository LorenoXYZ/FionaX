const DECIMAL_INTEGER = /^-?\d+$/;

/**
 * Formats a decimal integer string with thousands separators, using only
 * string and regex operations — never `Number()` — so a 64-bit Stellar
 * sequence number (which can exceed `Number.MAX_SAFE_INTEGER`) never loses
 * precision on the way to the screen.
 */
export function formatBigIntDecimal(value: string): string {
  if (!DECIMAL_INTEGER.test(value)) {
    throw new Error(`Not a decimal integer string: ${value}`);
  }

  const negative = value.startsWith("-");
  const digits = negative ? value.slice(1) : value;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return negative ? `-${grouped}` : grouped;
}
