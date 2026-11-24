import { xdr } from "@stellar/stellar-sdk";
import type { BudgetError, FeeEvidence, MetricEvidence } from "@/app/tools/soroban-resource-budget-explainer/types";
import type { NormalizedSimulation } from "@/app/tools/soroban-resource-budget-explainer/lib/simulation-result";

export interface DecodedResources {
  metrics: MetricEvidence[];
  resourceFee: string | null;
  footprintXdr: { readOnly: string[]; readWrite: string[] } | null;
}

function emptyMetrics(): MetricEvidence[] {
  return [
    { name: "instructions", unit: "CPU instructions", value: null },
    { name: "readBytes", unit: "bytes", value: null },
    { name: "writeBytes", unit: "bytes", value: null }
  ];
}

export function decodeTransactionData(raw: string | null): { ok: true; decoded: DecodedResources } | { ok: false; error: BudgetError } {
  if (!raw) {
    return { ok: true, decoded: { metrics: emptyMetrics(), resourceFee: null, footprintXdr: null } };
  }
  try {
    const data = xdr.SorobanTransactionData.fromXDR(raw, "base64");
    const resources = data.resources();
    const footprint = resources.footprint();
    return {
      ok: true,
      decoded: {
        metrics: [
          { name: "instructions", unit: "CPU instructions", value: String(resources.instructions()) },
          { name: "readBytes", unit: "bytes", value: String(resources.readBytes()) },
          { name: "writeBytes", unit: "bytes", value: String(resources.writeBytes()) }
        ],
        resourceFee: data.resourceFee().toString(),
        footprintXdr: {
          readOnly: footprint.readOnly().map((key) => key.toXDR("base64")),
          readWrite: footprint.readWrite().map((key) => key.toXDR("base64"))
        }
      }
    };
  } catch {
    return { ok: false, error: { code: "malformed_data", message: "transactionData is not SorobanTransactionData XDR." } };
  }
}

export function collectFees(simulation: NormalizedSimulation, resourceFee: string | null, envelopeFee: string | null): FeeEvidence[] {
  return [
    { name: "minResourceFee", value: simulation.minResourceFee },
    { name: "resourceFee", value: resourceFee },
    { name: "envelopeFee", value: envelopeFee },
    { name: "restoreMinResourceFee", value: simulation.restoreMinResourceFee }
  ];
}

export function readEnvelopeFee(raw: string | null): { ok: true; fee: string | null } | { ok: false; error: BudgetError } {
  if (!raw) return { ok: true, fee: null };
  try {
    const envelope = xdr.TransactionEnvelope.fromXDR(raw, "base64");
    const arm = envelope.switch().name;
    if (arm === "envelopeTypeTx") return { ok: true, fee: envelope.v1().tx().fee().toString() };
    if (arm === "envelopeTypeTxV0") return { ok: true, fee: envelope.v0().tx().fee().toString() };
    if (arm === "envelopeTypeTxFeeBump") return { ok: true, fee: envelope.feeBump().tx().fee().toString() };
    return { ok: false, error: { code: "unsupported_variant", message: "That envelope type has no fee field this tool reads." } };
  } catch {
    return { ok: false, error: { code: "malformed_data", message: "The optional envelope is not transaction XDR." } };
  }
}
