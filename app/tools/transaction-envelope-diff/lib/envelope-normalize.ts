import { xdr } from "@stellar/stellar-sdk";
import type { EnvelopeKind } from "@/app/tools/transaction-envelope-diff/types";

/** A decoded, canonical view of one envelope. */
export interface CanonicalEnvelope {
  kind: EnvelopeKind;
  /** Canonical source account (the transaction's own source override). */
  sourceAccount: string | null;
  /** Canonical fee, as a decimal string. */
  fee: string;
  /** Canonical sequence number, as a decimal string. */
  seqNum: string;
  /** Canonical memo. */
  memo: string;
  /** Canonical preconditions. */
  preconditions: string;
  /** Canonical operations, in envelope order. */
  operations: string[];
  /** Canonical signatures (order-insensitive set for comparison). */
  signatures: string[];
  /** For fee-bump envelopes, the canonical inner envelope. */
  innerEnvelope: string | null;
}

export class EnvelopeDecodeError extends Error {
  constructor(
    message: string,
    public code: "malformed_data" | "unsupported_variant"
  ) {
    super(message);
    this.name = "EnvelopeDecodeError";
  }
}

/** Serialize any XDR value that exposes toXDR into a canonical base64 string. */
function canon(value: unknown): string {
  const v = value as { toXDR(format?: string): string };
  return v.toXDR("base64");
}

/** Serialize an Int64/Uint64 Hyper into a canonical decimal string. */
function canonInt(value: unknown): string {
  const v = value as { toString(): string };
  return v.toString();
}

/** Serialize a Buffer (hint/signature) into a canonical hex string. */
function canonBuffer(value: unknown): string {
  const v = value as Buffer;
  return v.toString("hex");
}

function canonSignatures(signatures: unknown[]): string[] {
  return signatures.map((sig) => {
    const s = sig as { hint(value?: Buffer): Buffer; signature(value?: Buffer): Buffer };
    return `${canonBuffer(s.hint())}:${canonBuffer(s.signature())}`;
  });
}

function readTransaction(tx: unknown): Omit<CanonicalEnvelope, "kind" | "signatures" | "innerEnvelope"> {
  const t = tx as {
    sourceAccount(value?: unknown): unknown;
    fee(value?: number): number;
    seqNum(value?: unknown): unknown;
    cond(value?: unknown): unknown;
    memo(value?: unknown): unknown;
    operations(value?: unknown[]): unknown[];
  };

  const sourceAccount = t.sourceAccount();
  const operations = (t.operations() ?? []).map((op) => {
    const o = op as { toXDR(format?: string): string };
    return o.toXDR("base64");
  });

  return {
    sourceAccount: sourceAccount ? canon(sourceAccount) : null,
    fee: String(t.fee()),
    seqNum: canonInt(t.seqNum()),
    memo: canon(t.memo()),
    preconditions: canon(t.cond()),
    operations
  };
}

/** Decode and normalize a single base64 XDR envelope. */
export function normalizeEnvelope(base64: string): CanonicalEnvelope {
  let envelope: InstanceType<typeof xdr.TransactionEnvelope>;
  try {
    envelope = xdr.TransactionEnvelope.fromXDR(base64, "base64");
  } catch {
    throw new EnvelopeDecodeError("The input is not a valid transaction envelope XDR.", "malformed_data");
  }

  const kind = envelope.switch();
  const kindName = kind.name as string;

  if (kindName === "envelopeTypeTxV0") {
    const v0 = envelope.v0() as {
      tx(value?: unknown): unknown;
      signatures(value?: unknown[]): unknown[];
    };
    const body = readTransaction(v0.tx());
    return {
      kind: "v0",
      ...body,
      signatures: canonSignatures(v0.signatures()),
      innerEnvelope: null
    };
  }

  if (kindName === "envelopeTypeTx") {
    const v1 = envelope.v1() as {
      tx(value?: unknown): unknown;
      signatures(value?: unknown[]): unknown[];
    };
    const body = readTransaction(v1.tx());
    return {
      kind: "v1",
      ...body,
      signatures: canonSignatures(v1.signatures()),
      innerEnvelope: null
    };
  }

  if (kindName === "envelopeTypeTxFeeBump") {
    const feeBump = envelope.feeBump() as {
      tx(value?: unknown): unknown;
      signatures(value?: unknown[]): unknown[];
    };
    const fb = feeBump.tx() as {
      feeSource(value?: unknown): unknown;
      fee(value?: unknown): unknown;
      innerTx(value?: unknown): unknown;
    };
    const innerTx = fb.innerTx() as {
      v1(value?: unknown): unknown;
    };
    // The fee-bump inner transaction is always a V1 transaction, but re-derive
    // its canonical form through the same reader for consistency.
    const innerV1 = innerTx.v1();
    const innerBody = readTransaction(innerV1);
    const innerSignatures = canonSignatures(feeBump.signatures());

    return {
      kind: "fee_bump",
      sourceAccount: canon(fb.feeSource()),
      fee: canonInt(fb.fee()),
      seqNum: innerBody.seqNum,
      memo: innerBody.memo,
      preconditions: innerBody.preconditions,
      operations: innerBody.operations,
      signatures: innerSignatures,
      innerEnvelope: canon(innerV1)
    };
  }

  throw new EnvelopeDecodeError("Unsupported transaction envelope variant.", "unsupported_variant");
}
