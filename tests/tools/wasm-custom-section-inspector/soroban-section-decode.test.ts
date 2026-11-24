import { describe, expect, it } from "vitest";
import { decodeEnvironment, decodePublisher, decodeSpec } from "@/app/tools/wasm-custom-section-inspector/lib/soroban-section-decode";
import { environmentXdr, metaXdr, specXdr } from "@/tests/tools/wasm-custom-section-inspector/fixtures/normal.fixture";

describe("soroban section decode", () => {
  it("decodes environment, a function, an error, and publisher metadata separately", () => {
    expect(decodeEnvironment(environmentXdr())).toEqual({ protocol: "22", preRelease: "0" });
    const spec = decodeSpec(specXdr());
    expect(spec?.functions[0]?.name).toBe("pay");
    expect(spec?.errors[0]?.name).toBe("PayErr");
    expect(spec?.errors[0]?.cases[0]?.value).toBe("1");
    expect(decodePublisher(metaXdr())).toEqual([{ key: "rsver", value: "1" }]);
  });

  it("does not treat unsupported XDR as an empty section", () => {
    expect(decodeEnvironment(Uint8Array.from([1, 2, 3, 4]))).toBeNull();
  });
});
