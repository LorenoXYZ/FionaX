import { copy } from "@/app/tools/sequence-inspector/copy";

export function SequenceInspectorEmptyState() {
  return <p className="text-sm text-[#68758a]">{copy.empty}</p>;
}
