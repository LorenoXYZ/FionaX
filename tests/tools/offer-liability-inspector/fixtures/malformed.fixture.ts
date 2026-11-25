import { accountId, native, usdA } from "./normal.fixture";
export const missingRatio = { id: "8", paging_token: "8", seller: accountId, selling: native, buying: usdA, amount: "1.0" };
export const unsupportedAsset = { asset_type: "liquidity_pool_shares", liquidity_pool_id: "abc" };
export const malformedPage = { records: [{ ...missingRatio }] };
