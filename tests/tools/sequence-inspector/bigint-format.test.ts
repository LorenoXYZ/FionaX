import { describe, expect, it } from "vitest";
import { formatBigIntDecimal } from "@/app/tools/sequence-inspector/lib/bigint-format";
import { highCurrentSequence } from "@/tests/tools/sequence-inspector/fixtures/high-sequence.fixture";

describe("formatBigIntDecimal", () => {
  it("groups digits in threes from the right", () => {
    expect(formatBigIntDecimal("1234567")).toBe("1,234,567");
  });

  it("leaves values under 1000 ungrouped", () => {
    expect(formatBigIntDecimal("0")).toBe("0");
    expect(formatBigIntDecimal("999")).toBe("999");
  });

  it("groups a value beyond Number.MAX_SAFE_INTEGER correctly", () => {
    expect(formatBigIntDecimal(highCurrentSequence)).toBe("9,223,372,036,854,774,808");
  });

  it("preserves a leading negative sign without grouping it", () => {
    expect(formatBigIntDecimal("-1234567")).toBe("-1,234,567");
  });

  it("rejects a non-decimal-integer string instead of silently formatting garbage", () => {
    expect(() => formatBigIntDecimal("12.5")).toThrow();
    expect(() => formatBigIntDecimal("abc")).toThrow();
    expect(() => formatBigIntDecimal("")).toThrow();
  });
});
