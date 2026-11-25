import { copy } from "@/app/tools/transaction-envelope-diff/copy";

export function TransactionEnvelopeDiffEmptyState() {
  return <p className="text-sm text-[#68758a]">{copy.empty}</p>;
}
