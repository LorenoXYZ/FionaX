import { describe, expect, it } from "vitest";
import { formatSize, formatStatus } from "@/app/tools/wasm-custom-section-inspector/lib/format";

describe("wasm formatting", () => {
  it("prints the raw byte size and does not call a missing section present", () => {
    expect(formatSize("1048576")).toBe("1048576 bytes");
    expect(formatStatus("missing")).toBe("not in this module");
    expect(formatStatus("undecodable")).toBe("present, XDR not decoded");
  });
});
