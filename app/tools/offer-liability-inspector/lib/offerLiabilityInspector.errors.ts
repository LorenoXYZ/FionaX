import { InspectorFailure, type InspectorCode } from "../types";
export function errorCode(error: unknown): InspectorCode {
  if (error instanceof InspectorFailure) return error.code;
  if (error && typeof error === "object") {
    const status = (error as { status?: number }).status;
    if (status === 404) return "not_found";
    if (status === 429) return "rate_limited";
  }
  return "request_failed";
}
