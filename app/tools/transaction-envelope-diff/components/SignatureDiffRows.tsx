import { copy } from "@/app/tools/transaction-envelope-diff/copy";
import { formatCanonicalValue, formatChangeKind } from "@/app/tools/transaction-envelope-diff/lib/format";
import type { SignatureDiff } from "@/app/tools/transaction-envelope-diff/types";

export function SignatureDiffRows({ signatureDiffs }: { signatureDiffs: SignatureDiff[] }) {
  if (signatureDiffs.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-extrabold text-[#172033]">{copy.signaturesTitle}</h3>
      <ul className="mt-2 divide-y divide-[#e3ecf5] rounded-lg border border-[#c7d6e8] bg-white/70">
        {signatureDiffs.map((d) => (
          <li key={d.value} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
            <span className="font-mono text-xs text-[#172033]">{formatCanonicalValue(d.value)}</span>
            <span className="text-xs font-bold uppercase text-[#68758a]">{formatChangeKind(d.kind)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
