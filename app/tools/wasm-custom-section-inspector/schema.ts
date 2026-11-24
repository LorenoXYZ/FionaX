import type { WasmError } from "@/app/tools/wasm-custom-section-inspector/types";
import { MAX_WASM_BYTES } from "@/app/tools/wasm-custom-section-inspector/lib/wasm-section-scan";

const SECRET_SEED = /^S[A-Z2-7]{55}$/;

function fail(code: WasmError["code"], message: string): { ok: false; error: WasmError } {
  return { ok: false, error: { code, message } };
}

export function validateWasmInput(raw: string): { ok: true; bytes: Uint8Array } | { ok: false; error: WasmError } {
  const text = raw.trim();
  if (!text) return fail("invalid_input", "Choose a Wasm file or paste its base64. An empty box is not a module.");
  if (text.split(/\s+/).some((token) => SECRET_SEED.test(token))) {
    return fail("invalid_input", "A secret seed was rejected and was not stored.");
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(text)) return fail("malformed_data", "The module must be base64.");
  const bytes = Uint8Array.from(Buffer.from(text, "base64"));
  if (bytes.length > MAX_WASM_BYTES) return fail("too_large", "The Wasm module is over 1 MiB.");
  return { ok: true, bytes };
}
