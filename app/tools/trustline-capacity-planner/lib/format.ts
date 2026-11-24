/**
 * Presentation-only helpers. Formatting lives here — never in components or
 * domain logic — so the exact seven-decimal amount string is always preserved
 * losslessly through the pipeline and only decorated at the very edge.
 */

const DECIMAL_AMOUNT = /^-?\d+(\.\d+)?$/;

/** Renders an amount with thousands separators on the whole part only. */
export function formatAmount(value: string): string {
  if (!DECIMAL_AMOUNT.test(value)) {
    throw new Error(`Not a decimal amount: "${value}"`);
  }

  const negative = value.startsWith("-");
  const unsigned = negative ? value.slice(1) : value;
  const [whole, fraction] = unsigned.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const frac = fraction ? `.${fraction}` : "";
  return `${negative ? "-" : ""}${grouped}${frac}`;
}

/** Formats the receiving capacity as a signed amount with its unit label. */
export function formatCapacity(value: string, assetCode: string): string {
  const sign = value.startsWith("-") ? "-" : "";
  const abs = sign ? value.slice(1) : value;
  return `${sign}${formatAmount(abs)} ${assetCode.toUpperCase()}`;
}
