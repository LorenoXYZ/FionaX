import { describe, expect, it } from "vitest";
import { formatAmount, formatCapacity } from "@/app/tools/trustline-capacity-planner/lib/format";

describe("formatAmount", () => {
  it("groups whole digits with thousands separators and preserves the fraction", () => {
    expect(formatAmount("1234567.0000000")).toBe("1,234,567.0000000");
  });

  it("preserves a negative sign without grouping it", () => {
    expect(formatAmount("-1234567.0000000")).toBe("-1,234,567.0000000");
  });

  it("leaves small values ungrouped", () => {
    expect(formatAmount("42.5")).toBe("42.5");
  });

  it("rejects a non-decimal-amount string", () => {
    expect(() => formatAmount("abc")).toThrow();
    expect(() => formatAmount("")).toThrow();
  });
});

describe("formatCapacity", () => {
  it("formats a positive capacity with its asset code", () => {
    expect(formatCapacity("84.5000000", "USDC")).toBe("84.5000000 USDC");
  });

  it("formats a negative capacity with a leading sign", () => {
    expect(formatCapacity("-15.0000000", "USDC")).toBe("-15.0000000 USDC");
  });

  it("uppercases the asset code", () => {
    expect(formatCapacity("1.0000000", "usdc")).toBe("1.0000000 USDC");
  });
});
