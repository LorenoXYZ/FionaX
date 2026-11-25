import { normalTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/normal.fixture";
export const malformedTrade = { ...normalTrade, base_amount: "1.00000001" };
export const unsupportedTrade = { ...normalTrade, base_asset_type: "liquidity_pool_shares" };
