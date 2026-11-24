import type { InspectorError, InspectorErrorCode } from "@/app/tools/trade-price-rational-inspector/types";
export class TradeDecodeError extends Error {
  constructor(public readonly code: InspectorErrorCode, message: string) { super(message); }
}
export function toToolError(error: unknown): InspectorError {
  if (error instanceof TradeDecodeError) return { code: error.code, message: error.message };
  return { code: "malformed_data", message: "Unable to inspect this batch. Check the pasted JSON." };
}
