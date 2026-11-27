import type { StellarNetwork } from "@/lib/stellar/horizon";
export type ErrorCode = "invalid_input" | "malformed_data" | "unsupported_variant" | "too_large" | "not_found" | "rate_limited" | "request_failed";
export class CalendarFailure extends Error { constructor(public code: ErrorCode) { super(code); } }
export interface Input { claimant: string; network: StellarNetwork }
export type Predicate = { kind: "unconditional" } | { kind: "absolute" | "relative"; seconds: string } | { kind: "and" | "or"; children: Predicate[] } | { kind: "not"; child: Predicate };
export interface Balance { id: string; pagingToken: string; asset: string; amount: string; claimant: string; claimantIndex: number; predicate: Predicate }
export interface CalendarRow extends Balance { deadline: string; phase: "expired" | "future" }
export interface UnresolvedRow extends Balance { reason: string }
export interface Result { network: StellarNetwork; claimant: string; known: CalendarRow[]; unresolved: UnresolvedRow[]; pagesFetched: number; recordsFetched: number; complete: boolean; nextCursor?: string; source: string }
export type Outcome = { ok: true; result: Result } | { ok: false; error: ErrorCode };
