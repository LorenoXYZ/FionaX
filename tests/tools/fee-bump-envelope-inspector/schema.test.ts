import { describe, expect, it } from "vitest";
import { validateInput, MAX_ENVELOPE_BYTES } from "@/app/tools/fee-bump-envelope-inspector/schema";
import { makeEnvelope, passphrase } from "./fixtures/normal.fixture";
import { malformedBase64 } from "./fixtures/malformed.fixture";
describe("validateInput", () => {
  it("requires both inputs and rejects seed-like values", () => {
    expect(validateInput("", passphrase)).toMatchObject({ ok: false, error: { code: "invalid_input" } });
    expect(validateInput(makeEnvelope().envelope, "")).toMatchObject({ ok: false, error: { code: "invalid_input" } });
    expect(validateInput("S" + "A".repeat(55), passphrase)).toMatchObject({ ok: false, error: { code: "invalid_input" } });
  });
  it("rejects malformed and noncanonical base64", () => {
    expect(validateInput(malformedBase64, passphrase)).toMatchObject({ ok: false, error: { code: "malformed_data" } });
    expect(validateInput("AAAA====", passphrase)).toMatchObject({ ok: false, error: { code: "malformed_data" } });
  });
  it("enforces the decoded size boundary", () => {
    expect(validateInput(Buffer.alloc(MAX_ENVELOPE_BYTES).toString("base64"), passphrase).ok).toBe(true);
    expect(validateInput(Buffer.alloc(MAX_ENVELOPE_BYTES + 1).toString("base64"), passphrase)).toMatchObject({ ok: false, error: { code: "too_large" } });
  });
});
