import { describe, expect, it } from "vitest";
import { parseAmount, parseTradeRecord } from "@/app/tools/trade-price-rational-inspector/lib/trade-records";
import { normalTrade, issuerB } from "@/tests/tools/trade-price-rational-inspector/fixtures/normal.fixture";
import { maxTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/boundary.fixture";
import { malformedTrade, unsupportedTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/malformed.fixture";
describe("Horizon trade records", () => {
  it("parses exact stroops and retains both issuers", () => {
    expect(parseTradeRecord(normalTrade)).toMatchObject({ baseAmount: 10_000_000n, counterAmount: 20_000_000n, counter: { issuer: issuerB } });
    expect(parseAmount("922337203685.4775807")).toBe(9_223_372_036_854_775_807n);
    expect(parseTradeRecord(maxTrade).id).toBe(maxTrade.id);
  });
  it("rejects precision overflow and unsupported asset variants", () => {
    expect(() => parseTradeRecord(malformedTrade)).toThrow();
    expect(() => parseTradeRecord(unsupportedTrade)).toThrow();
    expect(() => parseTradeRecord({ ...normalTrade, trade_type: "liquidity_pool" })).toThrow();
    expect(() => parseAmount("922337203685.4775808")).toThrow();
    expect(() => parseTradeRecord({ ...normalTrade, counter_asset_issuer: "bad" })).toThrow();
    expect(() => parseTradeRecord({ ...normalTrade, base_account: "bad" })).toThrow();
    expect(parseTradeRecord({ ...normalTrade, base_account: issuerB }).baseAccount).toBe(issuerB);
    expect(() => parseTradeRecord({ ...normalTrade, id: 68836785177763841 })).toThrow();
  });
});
