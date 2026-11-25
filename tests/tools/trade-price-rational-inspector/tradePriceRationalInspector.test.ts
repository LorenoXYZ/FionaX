import { describe, expect, it, vi } from "vitest";
import { runTradePriceRationalInspector as run } from "@/app/tools/trade-price-rational-inspector/lib/tradePriceRationalInspector";
import { normalTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/normal.fixture";
import { reciprocalTrade, roundedTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/boundary.fixture";
import { malformedTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/malformed.fixture";
import { noPriceTrade, zeroTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/incomplete.fixture";
describe("trade inspector", () => {
  it("compares normal, reciprocal and rounded fills without requests", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    try {
      const result = run({ source: "array", records: [normalTrade, reciprocalTrade, roundedTrade] });
      expect(result.rows.map((r) => r.verdict)).toEqual(["exact", "exact", "within_rounding"]);
      expect(result.rows[1].sellerPrice).toEqual({ n: 2n, d: 1n });
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally { fetchSpy.mockRestore(); }
  });
  it("accepts a Horizon reversed-side trade with a one-stroop rounding difference", () => {
    const row = { ...normalTrade, base_is_seller: false, base_amount: "0.0000050", counter_amount: "0.0000009", price: { n: 2, d: 11 } };
    expect(run({ source: "array", records: [row] }).rows[0]).toMatchObject({ verdict: "within_rounding", crossDifference: -1n });
  });
  it("keeps partial malformed and absent evidence separate from valid comparisons", () => {
    const result = run({ source: "horizon_page", records: [normalTrade, malformedTrade, noPriceTrade, zeroTrade] });
    expect(result.rows.map((r) => r.verdict)).toEqual(["exact", "malformed", "incomplete", "incomplete"]);
    expect(result).toMatchObject({ compared: 1, malformed: 1, incomplete: 2 });
  });
});
