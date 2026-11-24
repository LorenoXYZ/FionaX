import { Keypair } from "@stellar/stellar-sdk";
import { describe, expect, it } from "vitest";
import { validateWasmInput } from "@/app/tools/wasm-custom-section-inspector/schema";
import { MAX_WASM_BYTES } from "@/app/tools/wasm-custom-section-inspector/lib/wasm-section-scan";
import { normalWasm, toBase64 } from "@/tests/tools/wasm-custom-section-inspector/fixtures/normal.fixture";

describe("validateWasmInput", () => {
  it("accepts base64 of a module", () => {
    expect(validateWasmInput(toBase64(normalWasm())).ok).toBe(true);
  });

  it("rejects empty, secret, and oversized input", () => {
    expect(validateWasmInput(" ").ok).toBe(false);
    const secret = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 9)).secret();
    expect(JSON.stringify(validateWasmInput(secret))).not.toContain(secret);
    const huge = Buffer.alloc(MAX_WASM_BYTES + 1).toString("base64");
    const oversized = validateWasmInput(huge);
    expect(oversized.ok).toBe(false);
    if (!oversized.ok) expect(oversized.error.code).toBe("too_large");
  });
});
