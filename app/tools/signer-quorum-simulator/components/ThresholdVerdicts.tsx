import { Badge } from "@/components/ui/Badge";
import { formatThreshold } from "@/app/tools/signer-quorum-simulator/lib/format";
import type { ThresholdLevel, ThresholdVerdict } from "@/app/tools/signer-quorum-simulator/types";

const LEVEL_LABELS: Record<ThresholdLevel, string> = {
  low: "Low threshold",
  medium: "Medium threshold",
  high: "High threshold"
};

const ORDER: ThresholdLevel[] = ["low", "medium", "high"];

export function ThresholdVerdicts({ verdicts }: { verdicts: Record<ThresholdLevel, ThresholdVerdict> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {ORDER.map((level) => {
        const verdict = verdicts[level];
        const reached = verdict.reached;
        return (
          <div key={level} className="rounded-lg border border-[#c7d6e8] bg-white/70 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#68758a]">{LEVEL_LABELS[level]}</p>
            <div className="mt-2 flex items-center justify-between">
              <Badge tone={reached ? "success" : "muted"}>{reached ? "reached" : "short"}</Badge>
              {verdict.shortfall > 0 ? (
                <span className="text-xs font-bold text-[#9a513f]">−{verdict.shortfall}</span>
              ) : null}
            </div>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#68758a]">Needed</dt>
                <dd className="font-bold text-[#172033]">{formatThreshold(verdict.threshold)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#68758a]">Selected</dt>
                <dd className="font-bold text-[#172033]">{verdict.selectedWeight}</dd>
              </div>
            </dl>
          </div>
        );
      })}
    </div>
  );
}
