import type { WasmErrorCode } from "@/app/tools/wasm-custom-section-inspector/types";

export const copy = {
  title: "Wasm Custom Section Inspector",
  eyebrow: "Soroban",
  idle: "Inspect Soroban environment, interface, and publisher sections in one local Wasm file. The module is not executed.",
  loading: "Reading custom sections…",
  empty: "Choose a Wasm file up to 1 MiB, or paste its base64.",
  moduleLabel: "Wasm module (base64)",
  fileLabel: "Wasm file",
  submit: "Inspect sections",
  resultTitle: "Custom sections",
  errors: {
    invalid_input: "Add a Wasm module. A secret seed is refused and is not stored.",
    malformed_data: "The header, a section length, or a section name could not be read.",
    unsupported_variant: "Only Wasm version 1 is inspected.",
    too_large: "The module is over 1 MiB."
  } satisfies Record<WasmErrorCode, string>
};
