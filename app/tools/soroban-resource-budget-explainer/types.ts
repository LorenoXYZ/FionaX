export type BudgetErrorCode = "invalid_input" | "malformed_data" | "unsupported_variant" | "too_large";

export interface BudgetError {
  code: BudgetErrorCode;
  message: string;
}

export type SimulationOutcome = "success" | "restore" | "failure";

export interface BudgetInput {
  simulationJson: string;
  envelopeXdr: string | null;
}

export interface MetricEvidence {
  name: "instructions" | "readBytes" | "writeBytes";
  unit: string;
  value: string | null;
}

export interface FeeEvidence {
  name: "minResourceFee" | "resourceFee" | "envelopeFee" | "restoreMinResourceFee";
  value: string | null;
}

export interface FootprintKeyEvidence {
  access: "readOnly" | "readWrite";
  kind: string;
  contractId: string | null;
  durability: string | null;
  supported: boolean;
}

export interface BudgetResult {
  outcome: SimulationOutcome;
  metrics: MetricEvidence[];
  fees: FeeEvidence[];
  footprint: FootprintKeyEvidence[];
  completeness: "complete" | "incomplete";
  missing: string[];
  failureMessage: string | null;
}
