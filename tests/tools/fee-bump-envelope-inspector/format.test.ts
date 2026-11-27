import { describe, expect, it } from "vitest";
import { stroopsToXlm } from "@/app/tools/fee-bump-envelope-inspector/lib/format";
describe("format", () => {
  it("preserves exact 64-bit stroop values", () => expect(stroopsToXlm("9223372036854775807")).toBe("922337203685.4775807 XLM"));
});
