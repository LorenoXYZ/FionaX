import { describe, expect, it } from "vitest";
import {
  formatCanonicalValue,
  formatChangeKind,
  formatEnvelopeKind
} from "@/app/tools/transaction-envelope-diff/lib/format";

describe("formatCanonicalValue", () => {
  it("leaves short values untouched", () => {
    expect(formatCanonicalValue("short")).toBe("short");
  });

  it("truncates long values without changing the stored value", () => {
    const value = "A".repeat(60);
    const formatted = formatCanonicalValue(value);
    expect(formatted).toContain("…");
    expect(formatted.length).toBeLessThan(value.length);
  });
});

describe("formatEnvelopeKind", () => {
  it("maps known kinds to human labels", () => {
    expect(formatEnvelopeKind("v0")).toBe("legacy (v0)");
    expect(formatEnvelopeKind("v1")).toBe("current (v1)");
    expect(formatEnvelopeKind("fee_bump")).toBe("fee bump");
  });

  it("passes through unknown kinds verbatim", () => {
    expect(formatEnvelopeKind("other")).toBe("other");
  });
});

describe("formatChangeKind", () => {
  it("maps known change kinds", () => {
    expect(formatChangeKind("added")).toBe("added");
    expect(formatChangeKind("removed")).toBe("removed");
    expect(formatChangeKind("changed")).toBe("changed");
  });

  it("passes through unknown kinds", () => {
    expect(formatChangeKind("other")).toBe("other");
  });
});
