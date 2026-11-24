export type EventFilterErrorCode = "invalid_input" | "malformed_data" | "unsupported_variant" | "too_large";

export interface EventFilterError {
  code: EventFilterErrorCode;
  message: string;
}

export type TopicKind = "symbol" | "string" | "u32" | "u64" | "i64" | "bool" | "address" | "bytes" | "wildcard";

export interface TopicPieceInput {
  type: TopicKind;
  value: string;
}

export interface TopicFilterInput {
  segments: TopicPieceInput[];
}

export interface FilterGroupInput {
  type: "contract" | "system" | null;
  contractIds: string[];
  topics: TopicFilterInput[];
}

export interface EventFilterInput {
  startLedger: string | null;
  endLedger: string | null;
  limit: string | null;
  filters: FilterGroupInput[];
}

export interface EncodedSegment {
  position: number;
  kind: "exact" | "single" | "multi";
  text: string;
  source: string;
}

export interface EventFilterResult {
  preview: string;
  completeness: "complete" | "incomplete";
  missing: string[];
  filters: Array<{
    type: "contract" | "system" | null;
    contractIds: string[];
    topics: EncodedSegment[][];
  }>;
}
