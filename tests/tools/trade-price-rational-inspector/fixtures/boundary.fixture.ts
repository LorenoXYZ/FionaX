import { normalTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/normal.fixture";
export const maxTrade = { ...normalTrade, id: "9223372036854775807-0", base_amount: "922337203685.4775807", counter_amount: "922337203685.4775807", price: { n: 1, d: 1 } };
export const reciprocalTrade = { ...normalTrade, id: "68836785177763841-1", base_amount: "2.0000000", counter_amount: "1.0000000", base_is_seller: false, price: { n: 1, d: 2 } };
export const roundedTrade = { ...normalTrade, counter_amount: "2.0000001" };
