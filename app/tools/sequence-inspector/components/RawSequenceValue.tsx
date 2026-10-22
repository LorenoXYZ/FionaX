import { copy } from "@/app/tools/sequence-inspector/copy";

/**
 * Shows the exact, unformatted string Horizon returned for `sequence` — no
 * thousands separators, no re-parsing through `Number`. A reader who wants
 * to paste the literal value (e.g. into a script) gets exactly what the API
 * sent, with no risk that display formatting silently altered it.
 */
export function RawSequenceValue({ value }: { value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[#68758a]">{copy.rawLabel}</p>
      <p className="mt-1 break-all font-mono text-sm text-[#4e5c73]">{value}</p>
    </div>
  );
}
