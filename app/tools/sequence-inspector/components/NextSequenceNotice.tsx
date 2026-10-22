import { copy } from "@/app/tools/sequence-inspector/copy";
import { formatSequenceNumber } from "@/app/tools/sequence-inspector/lib/format";

/** Shows the next valid sequence number a new transaction from this account must use. */
export function NextSequenceNotice({ nextSequence }: { nextSequence: string }) {
  return (
    <div className="rounded-lg border border-[#8edcf4]/70 bg-[#e0f6ff] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#146783]">{copy.nextLabel}</p>
      <p className="mt-1 break-all font-mono text-lg font-extrabold text-[#146783]">{formatSequenceNumber(nextSequence)}</p>
      <p className="mt-1 text-xs text-[#146783]">{copy.nextHelp}</p>
    </div>
  );
}
