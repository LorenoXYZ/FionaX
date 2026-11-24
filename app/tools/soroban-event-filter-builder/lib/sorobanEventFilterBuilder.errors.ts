import type { EventFilterError, EventFilterErrorCode } from "@/app/tools/soroban-event-filter-builder/types";

export function toEventFilterError(error: unknown): EventFilterError {
  if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
    const code = (error as { code?: unknown }).code;
    if (code === "invalid_input" || code === "malformed_data" || code === "unsupported_variant" || code === "too_large") {
      return { code, message: String((error as { message: unknown }).message) };
    }
  }
  const fallback: EventFilterErrorCode = "malformed_data";
  return { code: fallback, message: "The filter could not be built." };
}
