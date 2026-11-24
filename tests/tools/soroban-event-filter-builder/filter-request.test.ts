import { describe, expect, it } from "vitest";
import { buildFilterRequest } from "@/app/tools/soroban-event-filter-builder/lib/filter-request";
import { readEventFilterInput } from "@/app/tools/soroban-event-filter-builder/lib/event-filter-input";
import { wildcardOnly } from "@/tests/tools/soroban-event-filter-builder/fixtures/boundary.fixture";
import { missingLedger } from "@/tests/tools/soroban-event-filter-builder/fixtures/incomplete.fixture";
import { normalFilter } from "@/tests/tools/soroban-event-filter-builder/fixtures/normal.fixture";

function build(value: unknown) {
  const input = readEventFilterInput(value);
  if (!input.ok) throw new Error(input.error.message);
  return buildFilterRequest(input.input);
}

describe("buildFilterRequest", () => {
  it("shows nested filters and does not invent a missing limit as 100", () => {
    const result = build(missingLedger);
    expect(result.ok && result.result.completeness).toBe("incomplete");
    expect(result.ok && result.result.preview.includes("\"limit\"")).toBe(false);
    expect(result.ok && result.result.preview.includes("startLedger")).toBe(false);
  });

  it("places the wildcard in its segment position", () => {
    const result = build(wildcardOnly);
    const preview = result.ok ? JSON.parse(result.result.preview) : null;
    expect(preview.params.filters[0].topics[0]).toEqual(["*", "**"]);
  });

  it("includes both ledger bounds when they were supplied", () => {
    const result = build(normalFilter);
    const preview = result.ok ? JSON.parse(result.result.preview) : null;
    expect(preview.params.startLedger).toBe(1000);
    expect(preview.params.endLedger).toBe(1100);
    expect(preview.method).toBe("getEvents");
  });
});
