import { buildFilterRequest } from "@/app/tools/soroban-event-filter-builder/lib/filter-request";
import type { EventFilterError, EventFilterInput, EventFilterResult } from "@/app/tools/soroban-event-filter-builder/types";

export function runSorobanEventFilterBuilder(input: EventFilterInput): { ok: true; result: EventFilterResult } | { ok: false; error: EventFilterError } {
  return buildFilterRequest(input);
}
