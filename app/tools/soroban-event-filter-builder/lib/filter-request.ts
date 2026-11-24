import type { EncodedSegment, EventFilterInput, EventFilterResult } from "@/app/tools/soroban-event-filter-builder/types";
import { encodeTopic } from "@/app/tools/soroban-event-filter-builder/lib/topic-encoding";
import type { EventFilterError } from "@/app/tools/soroban-event-filter-builder/types";

export function buildFilterRequest(input: EventFilterInput): { ok: true; result: EventFilterResult } | { ok: false; error: EventFilterError } {
  const filters = [];
  for (const group of input.filters) {
    const topics: EncodedSegment[][] = [];
    for (const topic of group.topics) {
      const encoded = encodeTopic(topic.segments);
      if (!encoded.ok) return encoded;
      topics.push(encoded.segments);
    }
    filters.push({ type: group.type, contractIds: group.contractIds, topics });
  }

  const missing: string[] = [];
  if (!input.startLedger) missing.push("startLedger");
  if (!input.limit) missing.push("pagination.limit");

  const previewBody: Record<string, unknown> = {
    jsonrpc: "2.0",
    id: 1,
    method: "getEvents",
    params: {
      ...(input.startLedger ? { startLedger: Number(input.startLedger) } : {}),
      ...(input.endLedger ? { endLedger: Number(input.endLedger) } : {}),
      filters: filters.map((group) => ({
        ...(group.type ? { type: group.type } : {}),
        ...(group.contractIds.length > 0 ? { contractIds: group.contractIds } : {}),
        topics: group.topics.map((topic) => topic.map((segment) => segment.text))
      })),
      ...(input.limit ? { pagination: { limit: Number(input.limit) } } : {})
    }
  };

  return {
    ok: true,
    result: {
      preview: JSON.stringify(previewBody, null, 2),
      completeness: missing.length === 0 ? "complete" : "incomplete",
      missing,
      filters
    }
  };
}
