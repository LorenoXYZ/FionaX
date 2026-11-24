import type { FootprintKeyEvidence } from "@/app/tools/soroban-resource-budget-explainer/types";

export function FootprintKeyRows({ footprint }: { footprint: FootprintKeyEvidence[] }) {
  if (footprint.length === 0) return <p className="text-sm text-[#4e5c73]">No footprint keys were declared.</p>;
  return (
    <ul className="space-y-1">
      {footprint.map((key, index) => (
        <li key={index} className="break-all text-sm text-[#172033]">
          {key.access} {key.kind} {key.durability ?? "durability not declared"} {key.contractId ?? ""}
          {key.supported ? "" : " (unsupported key)"}
        </li>
      ))}
    </ul>
  );
}
