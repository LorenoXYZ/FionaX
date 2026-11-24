import { describe, expect, it } from "vitest";
import { computeReceivingCapacity } from "@/app/tools/trustline-capacity-planner/lib/capacity-math";

describe("computeReceivingCapacity", () => {
  it("subtracts balance and buying liabilities from the limit", () => {
    expect(
      computeReceivingCapacity({ limit: "100.0000000", balance: "12.0000000", buyingLiabilities: "3.5000000" })
    ).toBe("84.5000000");
  });

  it("returns zero at exact headroom", () => {
    expect(
      computeReceivingCapacity({ limit: "50.0000000", balance: "50.0000000", buyingLiabilities: "0.0000000" })
    ).toBe("0.0000000");
  });

  it("returns a negative value when liabilities exceed the limit", () => {
    expect(
      computeReceivingCapacity({ limit: "100.0000000", balance: "90.0000000", buyingLiabilities: "25.0000000" })
    ).toBe("-15.0000000");
  });

  it("preserves amounts beyond Number.MAX_SAFE_INTEGER", () => {
    const result = computeReceivingCapacity({
      limit: "9223372036854.7758070",
      balance: "10000000000.0000000",
      buyingLiabilities: "0.0000000"
    });
    expect(result).toBe("9213372036854.7758070");
    // A Number-based subtraction would have landed elsewhere — proving the
    // BigInt path, not just asserting the right answer.
    expect(result).not.toBe(String(Number("9223372036854.7758070") - 10000000000));
  });

  it("normalizes uneven decimals to seven places", () => {
    expect(
      computeReceivingCapacity({ limit: "10", balance: "1.5", buyingLiabilities: "0" })
    ).toBe("8.5000000");
  });

  it("rejects a non-decimal-amount input", () => {
    expect(() =>
      computeReceivingCapacity({ limit: "abc", balance: "1.0", buyingLiabilities: "0" })
    ).toThrow();
  });
});
