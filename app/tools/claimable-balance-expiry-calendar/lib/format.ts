export function formatAmount(value: string): string { return value; }
export function formatIdentity(value: string): string { return value; }
export function formatDeadline(seconds: string): string { return new Date(Number(BigInt(seconds) * 1000n)).toISOString().replace(".000Z", " UTC"); }
