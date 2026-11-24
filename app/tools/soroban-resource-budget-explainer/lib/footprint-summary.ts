import { StrKey, xdr } from "@stellar/stellar-sdk";
import type { FootprintKeyEvidence } from "@/app/tools/soroban-resource-budget-explainer/types";

function contractOf(address: xdr.ScAddress): string | null {
  const name = address.switch().name;
  if (name === "scAddressTypeContract") return StrKey.encodeContract(Buffer.from(address.contractId()));
  if (name === "scAddressTypeAccount") return StrKey.encodeEd25519PublicKey(Buffer.from(address.accountId().ed25519()));
  return null;
}

export function summarizeFootprint(keys: { readOnly: string[]; readWrite: string[] } | null): FootprintKeyEvidence[] {
  if (!keys) return [];
  const rows: FootprintKeyEvidence[] = [];
  for (const access of ["readOnly", "readWrite"] as const) {
    for (const raw of keys[access]) {
      const key = xdr.LedgerKey.fromXDR(raw, "base64");
      const kind = key.switch().name;
      if (kind !== "contractData") {
        rows.push({ access, kind, contractId: null, durability: null, supported: false });
        continue;
      }
      const data = key.contractData();
      rows.push({
        access,
        kind,
        contractId: contractOf(data.contract()),
        durability: data.durability().name,
        supported: true
      });
    }
  }
  return rows;
}
