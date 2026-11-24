import { customSection, environmentXdr, wasmModule } from "@/tests/tools/wasm-custom-section-inspector/fixtures/normal.fixture";

export function environmentOnly() {
  return wasmModule([customSection("contractenvmetav0", environmentXdr())]);
}
