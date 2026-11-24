import { describe, expect, it } from "vitest";
import { runSorobanEventFilterBuilder } from "@/app/tools/soroban-event-filter-builder/lib/sorobanEventFilterBuilder";
import { validateEventFilterInput } from "@/app/tools/soroban-event-filter-builder/schema";
import { normalJson } from "@/tests/tools/soroban-event-filter-builder/fixtures/normal.fixture";

describe("runSorobanEventFilterBuilder", () => {
  it("builds a complete preview for a bounded filter", () => {
    const parsed = validateEventFilterInput(normalJson());
    if (!parsed.ok) throw new Error(parsed.error.message);
    const result = runSorobanEventFilterBuilder(parsed.input);
    expect(result.ok && result.result.completeness).toBe("complete");
    expect(result.ok && result.result.filters[0]?.topics[0]?.[0]?.source).toBe("symbol:transfer");
  });
});
