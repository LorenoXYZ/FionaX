import { describe, expect, it } from "vitest";
import {
  formatSignerKey,
  formatSignerType,
  formatThreshold,
  formatWeight
} from "@/app/tools/signer-quorum-simulator/lib/format";

describe("formatSignerKey", () => {
  it("leaves short keys untouched", () => {
    expect(formatSignerKey("short")).toBe("short");
  });

  it("truncates long keys without changing the stored value", () => {
    const key = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
    expect(formatSignerKey(key)).toBe("GCEZWKCA…S674JZ");
  });
});

describe("formatWeight", () => {
  it("renders a number as text", () => {
    expect(formatWeight(3)).toBe("3");
  });

  it("marks a missing weight explicitly", () => {
    expect(formatWeight(null)).toBe("unknown");
  });
});

describe("formatThreshold", () => {
  it("renders a number as text", () => {
    expect(formatThreshold(2)).toBe("2");
  });

  it("marks a missing threshold explicitly", () => {
    expect(formatThreshold(null)).toBe("unknown");
  });
});

describe("formatSignerType", () => {
  it("maps known signer types to human labels", () => {
    expect(formatSignerType("ed25519")).toBe("ed25519 public key");
    expect(formatSignerType("preauth_tx")).toBe("pre-authorized transaction");
    expect(formatSignerType("sha256_hash")).toBe("sha256 hash (x)");
  });

  it("passes through unknown types verbatim", () => {
    expect(formatSignerType("something_else")).toBe("something_else");
  });
});
