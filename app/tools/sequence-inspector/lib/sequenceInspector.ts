import { fetchAccountSequence } from "@/app/tools/sequence-inspector/lib/sequence-fetch";
import { computeNextSequence } from "@/app/tools/sequence-inspector/lib/next-sequence";
import type { SequenceInspectorInput, SequenceInspectorResult } from "@/app/tools/sequence-inspector/types";

export interface SequenceInspectorDeps {
  loadSequence: (accountId: string) => Promise<string>;
}

/**
 * Default dependencies, backed by the shared Horizon client. Tests inject
 * their own fixture-returning function instead — there is no mocking
 * library in this project, so dependency injection is the mock seam.
 */
const defaultDeps: SequenceInspectorDeps = {
  loadSequence: (accountId) => fetchAccountSequence(accountId)
};

export async function runSequenceInspector(
  input: SequenceInspectorInput,
  deps: SequenceInspectorDeps = defaultDeps
): Promise<SequenceInspectorResult> {
  const currentSequence = await deps.loadSequence(input.accountId);

  return {
    accountId: input.accountId,
    currentSequence,
    nextSequence: computeNextSequence(currentSequence)
  };
}
