import { normalTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/normal.fixture";
export const noPriceTrade = { ...normalTrade, price: undefined };
export const zeroTrade = { ...normalTrade, base_amount: "0.0000000" };
