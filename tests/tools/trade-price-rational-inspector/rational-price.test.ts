import { describe, expect, it } from "vitest";
import { normalizedPrice, parsePrice, sellerPerspectivePrice } from "@/app/tools/trade-price-rational-inspector/lib/rational-price";
describe("rational price", () => {
  it("preserves exact string parts and reciprocates opposite offer direction", () => {
    expect(sellerPerspectivePrice(parsePrice({ n: "9223372036854775807", d: "3" }), false)).toEqual({ n: 3n, d: 9_223_372_036_854_775_807n });
    expect(normalizedPrice(parsePrice({ n: 2, d: 3 }))).toEqual({ n: 2n, d: 3n });
  });
  it("rejects unavailable, zero and imprecise denominators", () => {
    for (const price of [{ n: 1, d: 0 }, { n: 1, d: 2.5 }, { n: 1, d: 9_223_372_036_854_775_808n.toString() }, { n: 1, d: 3, x: 1 }, { n: 1 }, null]) expect(() => parsePrice(price)).toThrow();
  });
});
