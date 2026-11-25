import { describe, expect, it } from "vitest";
import { comparePrice } from "@/app/tools/trade-price-rational-inspector/lib/price-consistency";
describe("cross-multiplied quantity evidence", () => {
  it("classifies exact, boundary and beyond-boundary values", () => {
    const price = { n: 2n, d: 1n };
    expect(comparePrice(10n, 20n, price).verdict).toBe("exact");
    expect(comparePrice(10n, 23n, price)).toMatchObject({ verdict: "within_rounding", difference: 3n, bound: 3n });
    expect(comparePrice(10n, 24n, price).verdict).toBe("outside_rounding");
  });
  it("stays exact beyond JavaScript safe integers", () => {
    expect(comparePrice(9_223_372_036_854_775_807n, 9_223_372_036_854_775_807n, { n: 1n, d: 1n }).verdict).toBe("exact");
  });
});
