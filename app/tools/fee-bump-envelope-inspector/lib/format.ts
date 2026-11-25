export function stroopsToXlm(stroops: string): string {
  const value = BigInt(stroops);
  const sign = value < 0n ? "-" : "";
  const absolute = value < 0n ? -value : value;
  return `${sign}${absolute / 10000000n}.${(absolute % 10000000n).toString().padStart(7, "0")} XLM`;
}
