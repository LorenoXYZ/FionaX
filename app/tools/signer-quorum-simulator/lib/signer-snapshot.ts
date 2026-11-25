import type {
  AccountSigner,
  SignerSnapshot,
  SignerType,
  ThresholdLevel
} from "@/app/tools/signer-quorum-simulator/types";

/** Horizon JSON shape for a single signer entry. */
interface RawSigner {
  type?: unknown;
  key?: unknown;
  weight?: unknown;
}

/** Horizon JSON shape for the thresholds block. */
interface RawThresholds {
  low_threshold?: unknown;
  med_threshold?: unknown;
  high_threshold?: unknown;
}

/** Minimal Horizon account JSON shape this tool reads. */
interface RawAccount {
  id?: unknown;
  account_id?: unknown;
  signers?: unknown;
  thresholds?: unknown;
  /** Legacy Horizon field for the master key weight. */
  master_weight?: unknown;
}

const THRESHOLD_LEVELS: ThresholdLevel[] = ["low", "medium", "high"];

const SIGNER_TYPE_BY_PREFIX: Record<string, SignerType> = {
  G: "ed25519",
  T: "preauth_tx",
  X: "sha256_hash"
};

function inferSignerType(key: string): SignerType | null {
  return SIGNER_TYPE_BY_PREFIX[key[0]] ?? null;
}

function parseWeight(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 255) {
    return null;
  }
  return value;
}

function normalizeKey(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  return value;
}

/**
 * Parse the pasted Horizon account JSON into a protocol-shaped snapshot.
 * Throws a typed `SignerSnapshotError` on malformed or unsupported input so the
 * caller can map it to an actionable error code.
 */
export class SignerSnapshotError extends Error {
  constructor(
    message: string,
    public code: "malformed_data" | "unsupported_variant" | "invalid_input"
  ) {
    super(message);
    this.name = "SignerSnapshotError";
  }
}

function readThresholds(raw: RawAccount): Record<ThresholdLevel, number | null> {
  const thresholds = raw.thresholds as RawThresholds | undefined;
  if (thresholds === undefined || thresholds === null) {
    throw new SignerSnapshotError("The account record has no thresholds block.", "malformed_data");
  }

  const values: Partial<Record<ThresholdLevel, number | null>> = {
    low: parseWeight(thresholds.low_threshold),
    medium: parseWeight(thresholds.med_threshold),
    high: parseWeight(thresholds.high_threshold)
  };

  return {
    low: values.low ?? null,
    medium: values.medium ?? null,
    high: values.high ?? null
  };
}

function readMasterWeight(raw: RawAccount): number | null {
  if (raw.master_weight !== undefined) {
    return parseWeight(raw.master_weight);
  }
  // Newer Horizon responses fold the master key into `signers` with type
  // "ed25519_public_key" and no `key`, plus a `weight` — handled below.
  return null;
}

function readSigners(raw: RawAccount): AccountSigner[] {
  const signers = raw.signers;
  if (signers === undefined || signers === null) {
    throw new SignerSnapshotError("The account record has no signers array.", "malformed_data");
  }
  if (!Array.isArray(signers)) {
    throw new SignerSnapshotError("The account signers field is not a list.", "malformed_data");
  }

  const result: AccountSigner[] = [];
  for (const entry of signers) {
    const rawSigner = entry as RawSigner;
    const typeField = rawSigner.type;
    const key = normalizeKey(rawSigner.key);
    const weight = parseWeight(rawSigner.weight);

    // Master key entries carry type "ed25519_public_key" and no key value.
    if (typeField === "ed25519_public_key" && (key === null || key === "")) {
      result.push({
        weight,
        type: "ed25519",
        key: "master-key",
        isMasterKey: true
      });
      continue;
    }

    if (key === null) {
      // A signer entry with neither a key nor a recognizable master-key shape
      // is evidence we cannot act on.
      throw new SignerSnapshotError("A signer entry has no usable key.", "malformed_data");
    }

    const type = inferSignerType(key);
    if (type === null) {
      throw new SignerSnapshotError(`Unsupported signer key format for entry starting with "${key[0]}".`, "unsupported_variant");
    }

    result.push({ weight, type, key, isMasterKey: false });
  }

  return result;
}

/**
 * Normalize public signer/threshold records into a stable snapshot. The
 * account ID is read from `id` (full form) with `account_id` as a fallback.
 */
export function parseSignerSnapshot(rawJson: string): SignerSnapshot {
  let raw: unknown;
  try {
    raw = JSON.parse(rawJson);
  } catch {
    throw new SignerSnapshotError("The pasted text is not valid JSON.", "malformed_data");
  }

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new SignerSnapshotError("The pasted JSON is not an account object.", "malformed_data");
  }

  const account = raw as RawAccount;

  const accountId = normalizeKey(account.id ?? account.account_id);
  if (accountId === null) {
    throw new SignerSnapshotError("The account record has no account id.", "malformed_data");
  }

  const signers = readSigners(account);
  const thresholds = readThresholds(account);

  // If the master key was reported separately, fold it in as the canonical
  // master entry (the signers array may or may not already carry it).
  const masterWeight = readMasterWeight(account);
  const hasMasterEntry = signers.some((s) => s.isMasterKey);
  if (masterWeight !== null && !hasMasterEntry) {
    signers.unshift({ weight: masterWeight, type: "ed25519", key: "master-key", isMasterKey: true });
  }

  return {
    accountId,
    signers,
    thresholds,
    masterKeyWeight: masterWeight
  };
}

/** The ordered list of threshold levels this tool always reports. */
export function thresholdLevels(): ThresholdLevel[] {
  return THRESHOLD_LEVELS;
}
