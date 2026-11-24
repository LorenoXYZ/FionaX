export type WasmErrorCode = "invalid_input" | "malformed_data" | "unsupported_variant" | "too_large";

export interface WasmError {
  code: WasmErrorCode;
  message: string;
}

export type SectionStatus = "present" | "missing" | "undecodable";

export interface WasmSectionView {
  index: number;
  id: number;
  name: string | null;
  size: string;
}

export interface SpecFunctionView {
  name: string;
  doc: string;
}

export interface SpecErrorView {
  name: string;
  cases: Array<{ name: string; value: string }>;
}

export interface MetaEntryView {
  key: string;
  value: string;
}

export interface WasmResult {
  version: string;
  sections: WasmSectionView[];
  environment: { status: SectionStatus; protocol: string | null; preRelease: string | null };
  spec: { status: SectionStatus; functions: SpecFunctionView[]; errors: SpecErrorView[] };
  publisher: { status: SectionStatus; entries: MetaEntryView[] };
  completeness: "complete" | "incomplete";
}
