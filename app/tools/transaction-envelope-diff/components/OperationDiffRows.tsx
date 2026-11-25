import { copy } from "@/app/tools/transaction-envelope-diff/copy";
import { formatCanonicalValue, formatChangeKind } from "@/app/tools/transaction-envelope-diff/lib/format";
import type { OperationDiff } from "@/app/tools/transaction-envelope-diff/types";

export function OperationDiffRows({ operationDiffs }: { operationDiffs: OperationDiff[] }) {
  if (operationDiffs.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-extrabold text-[#172033]">{copy.operationsTitle}</h3>
      <ul className="mt-2 divide-y divide-[#e3ecf5] rounded-lg border border-[#c7d6e8] bg-white/70">
        {operationDiffs.map((d) => (
          <li key={d.index} className="px-4 py-2.5 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#172033]">operation {d.index}</span>
              <span className="text-xs font-bold uppercase text-[#68758a]">{formatChangeKind(d.kind)}</span>
            </div>
            {d.kind === "changed" ? (
              <div className="mt-1 space-y-0.5 font-mono text-xs">
                <p className="text-[#9a513f] line-through">− {formatCanonicalValue(d.before ?? "")}</p>
                <p className="text-[#17664b]">+ {formatCanonicalValue(d.after ?? "")}</p>
              </div>
            ) : d.kind === "added" ? (
              <p className="mt-1 font-mono text-xs text-[#17664b]">+ {formatCanonicalValue(d.after ?? "")}</p>
            ) : (
              <p className="mt-1 font-mono text-xs text-[#9a513f] line-through">− {formatCanonicalValue(d.before ?? "")}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
