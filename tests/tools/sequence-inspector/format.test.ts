import { describe, expect, it } from "vitest";
import { formatSequenceNumber } from "@/app/tools/sequence-inspector/lib/format";
import { highCurrentSequence } from "@/tests/tools/sequence-inspector/fixtures/high-sequence.fixture";

describe("formatSequenceNumber", () => {
  it("groups digits with thousands separators", () => {
    expect(formatSequenceNumber("410911031242866178")).toBe("410,911,031,242,866,178");
  });

  it("formats a value beyond Number.MAX_SAFE_INTEGER without precision loss", () => {
    expect(formatSequenceNumber(highCurrentSequence)).toBe("9,223,372,036,854,774,808");
  });

  it("leaves a short value ungrouped", () => {
    expect(formatSequenceNumber("42")).toBe("42");
  });
});
