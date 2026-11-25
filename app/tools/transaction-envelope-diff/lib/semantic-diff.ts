import type { CanonicalEnvelope } from "@/app/tools/transaction-envelope-diff/lib/envelope-normalize";
import type { FieldDiff, OperationDiff } from "@/app/tools/transaction-envelope-diff/types";

interface FieldAccessor {
  path: string;
  get: (e: CanonicalEnvelope) => string | null;
}

const FIELDS: FieldAccessor[] = [
  { path: "sourceAccount", get: (e) => e.sourceAccount },
  { path: "fee", get: (e) => e.fee },
  { path: "seqNum", get: (e) => e.seqNum },
  { path: "memo", get: (e) => e.memo },
  { path: "preconditions", get: (e) => e.preconditions }
];

/** Compare the canonical scalar fields, ignoring operations and signatures. */
export function diffFields(left: CanonicalEnvelope, right: CanonicalEnvelope): FieldDiff[] {
  const diffs: FieldDiff[] = [];

  for (const field of FIELDS) {
    const before = field.get(left);
    const after = field.get(right);

    if (before === after) {
      continue;
    }

    if (before === null && after !== null) {
      diffs.push({ path: field.path, kind: "added", after });
    } else if (before !== null && after === null) {
      diffs.push({ path: field.path, kind: "removed", before });
    } else {
      diffs.push({ path: field.path, kind: "changed", before: before ?? undefined, after: after ?? undefined });
    }
  }

  return diffs;
}

/** Compare operation lists in envelope order, reporting insert/delete/change. */
export function diffOperations(left: CanonicalEnvelope, right: CanonicalEnvelope): OperationDiff[] {
  const diffs: OperationDiff[] = [];
  const max = Math.max(left.operations.length, right.operations.length);

  for (let i = 0; i < max; i++) {
    const before = left.operations[i];
    const after = right.operations[i];

    if (before === undefined && after !== undefined) {
      diffs.push({ index: i, kind: "added", after });
    } else if (before !== undefined && after === undefined) {
      diffs.push({ index: i, kind: "removed", before });
    } else if (before !== after) {
      diffs.push({ index: i, kind: "changed", before, after });
    }
  }

  return diffs;
}
