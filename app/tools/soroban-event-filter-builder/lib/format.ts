import type { EncodedSegment } from "@/app/tools/soroban-event-filter-builder/types";

export function formatSegment(segment: EncodedSegment): string {
  if (segment.kind === "exact") return segment.text;
  return segment.text;
}

export function formatTopic(segments: EncodedSegment[]): string {
  return segments.map((segment) => `${segment.position}:${segment.source}`).join(" ");
}

export function formatLedger(value: string | null): string {
  return value ?? "not declared";
}
