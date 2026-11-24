import { copy } from "@/app/tools/soroban-event-filter-builder/copy";

export function FilterLimitNotice({ missing }: { missing: string[] }) {
  if (missing.length === 0) return null;
  return (
    <p className="text-sm text-[#9a513f]" role="status">
      {copy.incompleteBody} Missing: {missing.join(", ")}.
    </p>
  );
}
