import { describe, expect, it } from "vitest";
import { coverSections } from "@/app/tools/wasm-custom-section-inspector/lib/section-coverage";
import { scanWasm } from "@/app/tools/wasm-custom-section-inspector/lib/wasm-section-scan";
import { duplicateMeta } from "@/tests/tools/wasm-custom-section-inspector/fixtures/boundary.fixture";
import { environmentOnly } from "@/tests/tools/wasm-custom-section-inspector/fixtures/incomplete.fixture";
import { metaXdr } from "@/tests/tools/wasm-custom-section-inspector/fixtures/normal.fixture";

describe("coverSections", () => {
  it("keeps a missing publisher section distinct from present environment metadata", () => {
    const scanned = scanWasm(environmentOnly());
    if (!scanned.ok) throw new Error(scanned.error.message);
    const covered = coverSections(scanned.version, scanned.sections);
    expect(covered.environment.status).toBe("present");
    expect(covered.publisher.status).toBe("missing");
    expect(covered.spec.status).toBe("missing");
  });

  it("preserves two publisher sections in order", () => {
    const scanned = scanWasm(duplicateMeta(metaXdr("a", "1"), metaXdr("b", "2")));
    if (!scanned.ok) throw new Error(scanned.error.message);
    const covered = coverSections(scanned.version, scanned.sections);
    expect(covered.publisher.entries.map((entry) => entry.key)).toEqual(["a", "b"]);
    expect(covered.sections.map((section) => section.index)).toEqual([0, 1]);
  });
});
