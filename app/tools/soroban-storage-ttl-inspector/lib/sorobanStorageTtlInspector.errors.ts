import type { TtlError, TtlErrorCode } from "@/app/tools/soroban-storage-ttl-inspector/types";

const CODES: TtlErrorCode[] = ["invalid_input", "malformed_data", "unsupported_variant", "too_large", "not_found", "rate_limited", "request_failed"];

export function toTtlError(error: unknown): TtlError {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (CODES.includes(code as TtlErrorCode)) return error as TtlError;
  }
  return { code: "request_failed", message: "The ledger lookup did not complete." };
}
