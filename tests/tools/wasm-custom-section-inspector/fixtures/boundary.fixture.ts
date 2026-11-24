import { customSection, wasmModule } from "@/tests/tools/wasm-custom-section-inspector/fixtures/normal.fixture";

export function largeDeclaredLength(): Uint8Array {
  const length = [0x80, 0x80, 0x80, 0x80, 0x10];
  return Uint8Array.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0, ...length]);
}

export function duplicateMeta(first: Uint8Array, second: Uint8Array) {
  return wasmModule([customSection("contractmetav0", first), customSection("contractmetav0", second)]);
}
