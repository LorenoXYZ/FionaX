export function formatMetric(value: string | null, unit: string): string {
  return value === null ? "not declared" : `${value} ${unit}`;
}

export function formatFee(value: string | null): string {
  return value === null ? "not declared" : value;
}
