import type { StellarNetwork } from "@/lib/stellar/horizon";
export type InspectorCode = "invalid_input" | "malformed_data" | "unsupported_variant" | "too_large" | "not_found" | "rate_limited" | "request_failed";
export class InspectorFailure extends Error { constructor(public code: InspectorCode, message: string) { super(message); } }
export interface InspectorInput { accountId: string; network: StellarNetwork }
export interface Asset { key: string; label: string }
export interface OfferEvidence { id: string; selling: Asset; buying: Asset; amount: bigint; priceN: bigint; priceD: bigint; buyingAmount: bigint }
export interface LiabilityGroup { asset: Asset; balance?: bigint; expectedSelling: bigint; expectedBuying: bigint; declaredSelling?: bigint; declaredBuying?: bigint; status: "covered" | "mismatch" | "incomplete" }
export interface InspectorResult { accountId: string; network: StellarNetwork; offers: OfferEvidence[]; groups: LiabilityGroup[]; pages: number; truncated: boolean; incomplete: boolean; notes: string[] }
export interface HorizonBalance { asset_type?: unknown; asset_code?: unknown; asset_issuer?: unknown; balance?: unknown; selling_liabilities?: unknown; buying_liabilities?: unknown }
export interface HorizonAccount { id?: unknown; balances?: unknown; subentry_count?: unknown; num_sponsoring?: unknown; num_sponsored?: unknown }
export interface HorizonOffer { id?: unknown; paging_token?: unknown; selling?: unknown; buying?: unknown; amount?: unknown; price_r?: unknown; seller?: unknown }
