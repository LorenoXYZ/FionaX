import { copy } from "@/app/tools/signer-quorum-simulator/copy";
import { formatSignerKey, formatSignerType, formatWeight } from "@/app/tools/signer-quorum-simulator/lib/format";
import type { SignerQuorumSimulatorResult } from "@/app/tools/signer-quorum-simulator/types";

type Contribution = SignerQuorumSimulatorResult["contributions"][number];

export function WeightContributionRows({ contributions }: { contributions: Contribution[] }) {
  if (contributions.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-extrabold text-[#172033]">{copy.contributionsTitle}</h3>
      <ul className="mt-2 divide-y divide-[#e3ecf5] rounded-lg border border-[#c7d6e8] bg-white/70">
        {contributions.map((c) => (
          <li key={c.key} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
            <div className="min-w-0">
              <p className="truncate font-mono text-xs text-[#172033]" title={c.key}>
                {c.isMasterKey ? "master key" : formatSignerKey(c.key)}
              </p>
              <p className="text-xs text-[#68758a]">{formatSignerType(c.type)}</p>
            </div>
            <div className="flex items-center gap-2">
              {c.duplicate ? <span className="text-xs font-bold text-[#5b4b8a]">duplicate</span> : null}
              <span className="font-bold text-[#172033]">+{formatWeight(c.weight)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
