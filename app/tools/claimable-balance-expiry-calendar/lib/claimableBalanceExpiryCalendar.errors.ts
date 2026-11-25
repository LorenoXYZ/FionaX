import { CalendarFailure, type ErrorCode } from "../types";
export function toCalendarError(error: unknown): ErrorCode { return error instanceof CalendarFailure ? error.code : "request_failed"; }
