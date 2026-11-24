import { describe, expect, it } from "vitest";
import { formatFee, formatMetric } from "@/app/tools/soroban-resource-budget-explainer/lib/format";

describe("budget formatting", () => {
  it("prints the integer and its unit without rounding", () => {
    expect(formatMetric("9007199254740993", "stroops")).toBe("9007199254740993 stroops");
    expect(formatFee(null)).toBe("not declared");
  });
});
