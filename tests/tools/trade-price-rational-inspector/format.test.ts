import { describe, expect, it } from "vitest";
import { formatAmount, formatAsset, formatRational } from "@/app/tools/trade-price-rational-inspector/lib/format";
import { issuerA } from "@/tests/tools/trade-price-rational-inspector/fixtures/normal.fixture";
describe("lossless display", () => {
  it("keeps seven places, large values and full issuer identity", () => {
    expect(formatAmount(9_223_372_036_854_775_807n)).toBe("922337203685.4775807");
    expect(formatAsset({ type: "credit_alphanum4", code: "USD", issuer: issuerA })).toContain(issuerA);
    expect(formatRational({ n: 2_147_483_647n, d: 3n })).toBe("2147483647/3");
  });
});
