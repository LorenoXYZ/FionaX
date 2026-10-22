import { copy } from "@/app/tools/sequence-inspector/copy";
import { formatSequenceNumber } from "@/app/tools/sequence-inspector/lib/format";

/** Shows the account's current sequence number, as returned by Horizon. */
export function SequenceSummary({ currentSequence }: { currentSequence: string }) {
  return (
    <div className="rounded-lg border border-[#cfe0ea] bg-white/70 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#68758a]">{copy.currentLabel}</p>
      <p className="mt-1 break-all font-mono text-lg font-extrabold text-[#172033]">{formatSequenceNumber(currentSequence)}</p>
      <p className="mt-1 text-xs text-[#68758a]">{copy.currentHelp}</p>
    </div>
  );
}
