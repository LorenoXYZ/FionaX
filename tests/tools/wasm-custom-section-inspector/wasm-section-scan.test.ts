import { describe, expect, it } from "vitest";
import { scanWasm } from "@/app/tools/wasm-custom-section-inspector/lib/wasm-section-scan";
import { largeDeclaredLength } from "@/tests/tools/wasm-custom-section-inspector/fixtures/boundary.fixture";
import { badMagic, badVersion, invalidUtf8Name } from "@/tests/tools/wasm-custom-section-inspector/fixtures/malformed.fixture";
import { normalWasm } from "@/tests/tools/wasm-custom-section-inspector/fixtures/normal.fixture";

describe("scanWasm", () => {
  it("keeps custom sections in occurrence order", () => {
    const scanned = scanWasm(normalWasm());
    expect(scanned.ok && scanned.sections.map((section) => section.customName)).toEqual([
      "contractenvmetav0",
      "contractspecv0",
      "contractmetav0"
    ]);
  });

  it("rejects a length that does not fit in an unsigned 32-bit integer", () => {
    const scanned = scanWasm(largeDeclaredLength());
    expect(scanned.ok).toBe(false);
    if (!scanned.ok) expect(scanned.error.code).toBe("malformed_data");
  });

  it("rejects a bad header, another version, and invalid UTF-8", () => {
    expect(scanWasm(badMagic()).ok).toBe(false);
    const version = scanWasm(badVersion());
    expect(version.ok).toBe(false);
    if (!version.ok) expect(version.error.code).toBe("unsupported_variant");
    const utf8 = scanWasm(invalidUtf8Name());
    expect(utf8.ok).toBe(false);
    if (!utf8.ok) expect(utf8.error.code).toBe("malformed_data");
  });
});
