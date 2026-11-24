import { customSection, wasmModule } from "@/tests/tools/wasm-custom-section-inspector/fixtures/normal.fixture";

export function badMagic() {
  return Uint8Array.from([0, 0, 0, 0, 1, 0, 0, 0]);
}

export function badVersion() {
  return Uint8Array.from([0x00, 0x61, 0x73, 0x6d, 2, 0, 0, 0]);
}

export function invalidUtf8Name() {
  const body = [1, 0xff];
  return wasmModule([[0, ...[body.length], ...body]]);
}

export function badKnownSection() {
  return wasmModule([customSection("contractenvmetav0", Uint8Array.from([1, 2, 3, 4]))]);
}
