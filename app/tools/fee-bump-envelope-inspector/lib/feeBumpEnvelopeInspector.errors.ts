import { copy } from "../copy";
import type { InspectorCode, InspectorError } from "../types";
export class InspectorFailure extends Error {
  constructor(public code: InspectorCode) { super(copy.errors[code]); }
}
export function toInspectorError(error: unknown): InspectorError {
  const code = error instanceof InspectorFailure ? error.code : "malformed_data";
  return { code, message: copy.errors[code] };
}
