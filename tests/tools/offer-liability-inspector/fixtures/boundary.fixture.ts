import { accountId, native, usdA } from "./normal.fixture";
export const fullPage = (offset: number) => Array.from({ length: 20 }, (_, index) => ({ id: String(offset + index + 1), paging_token: String(offset + index + 1), seller: accountId, selling: native, buying: usdA, amount: "0.0000001", price_r: { n: 1, d: 1 } }));
export const editedOffer = { id: "7", paging_token: "7", seller: accountId, selling: native, buying: usdA, amount: "3.0000000", price_r: { n: 2, d: 1 } };
