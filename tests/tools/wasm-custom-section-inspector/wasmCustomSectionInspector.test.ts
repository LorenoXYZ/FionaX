import { describe, expect, it } from "vitest";
import { runWasmCustomSectionInspector } from "@/app/tools/wasm-custom-section-inspector/lib/wasmCustomSectionInspector";
import { badKnownSection } from "@/tests/tools/wasm-custom-section-inspector/fixtures/malformed.fixture";
import { normalWasm } from "@/tests/tools/wasm-custom-section-inspector/fixtures/normal.fixture";

describe("runWasmCustomSectionInspector", () => {
  it("reports environment, function, error, and publisher metadata", () => {
    const result = runWasmCustomSectionInspector(normalWasm());
    expect(result.ok && result.result.completeness).toBe("complete");
    expect(result.ok && result.result.environment.protocol).toBe("22");
    expect(result.ok && result.result.spec.functions[0]?.name).toBe("pay");
    expect(result.ok && result.result.publisher.entries[0]?.key).toBe("rsver");
  });

  it("keeps a known section with bad XDR undecodable instead of missing", () => {
    const result = runWasmCustomSectionInspector(badKnownSection());
    expect(result.ok && result.result.environment.status).toBe("undecodable");
    expect(result.ok && result.result.publisher.status).toBe("missing");
  });
});
