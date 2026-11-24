export type InspectorErrorCode = "invalid_input" | "malformed_data" | "unsupported_variant" | "too_large";
export interface InspectorError { code: InspectorErrorCode; message: string }
export interface InspectorInput { records: unknown[]; source: "array" | "horizon_page" }
export interface AssetIdentity { type: "native" | "credit_alphanum4" | "credit_alphanum12"; code?: string; issuer?: string }
export interface Rational { n: bigint; d: bigint }
export interface TradeRecord { id: string; base: AssetIdentity; counter: AssetIdentity; baseAccount?: string; counterAccount?: string; baseAmount: bigint; counterAmount: bigint; baseIsSeller: boolean; price?: Rational }
export type RowVerdict = "exact" | "within_rounding" | "outside_rounding" | "incomplete" | "malformed";
export interface InspectedRow { index: number; id?: string; record?: TradeRecord; verdict: RowVerdict; reason: string; normalizedPrice?: Rational; sellerPrice?: Rational; crossDifference?: bigint; crossBound?: bigint }
export interface InspectorResult { source: InspectorInput["source"]; rows: InspectedRow[]; compared: number; incomplete: number; malformed: number }
