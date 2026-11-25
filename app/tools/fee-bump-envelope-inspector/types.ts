export type InspectorCode = "invalid_input" | "malformed_data" | "unsupported_variant" | "too_large";
export interface InspectorError { code: InspectorCode; message: string }
export interface InspectorInput { envelope: string; passphrase: string }
export interface SignatureInfo { hint: string; signature: string }
export interface OperationInfo { index: number; type: string; source: string | null }
export interface InspectorResult {
  feeSource: string; feeStroops: string; innerSource: string; innerSequence: string;
  innerHash: string; outerHash: string; operations: OperationInfo[];
  innerSignatures: SignatureInfo[]; outerSignatures: SignatureInfo[];
  networkPassphrase: string; evidence: "complete" | "incomplete";
}
