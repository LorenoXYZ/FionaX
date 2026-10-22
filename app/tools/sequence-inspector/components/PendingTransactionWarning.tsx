import { StatusMessage } from "@/components/ui/StatusMessage";
import { copy } from "@/app/tools/sequence-inspector/copy";

/**
 * Always shown alongside a successful result. Horizon's account resource has
 * no field for "a transaction is currently pending with this sequence" — the
 * only honest thing to do is warn that the possibility exists, every time,
 * rather than claim certainty this tool cannot verify.
 */
export function PendingTransactionWarning() {
  return <StatusMessage type="warning" title={copy.pendingWarningTitle} description={copy.pendingWarningBody} />;
}
