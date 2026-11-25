"use client";

import { useRef, useState } from "react";
import { validateTransactionEnvelopeDiffInput } from "@/app/tools/transaction-envelope-diff/schema";
import { runTransactionEnvelopeDiff } from "@/app/tools/transaction-envelope-diff/lib/transactionEnvelopeDiff";
import { toToolError } from "@/app/tools/transaction-envelope-diff/lib/transactionEnvelopeDiff.errors";
import type {
  TransactionEnvelopeDiffError,
  TransactionEnvelopeDiffResult
} from "@/app/tools/transaction-envelope-diff/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: TransactionEnvelopeDiffResult }
  | { status: "error"; error: TransactionEnvelopeDiffError };

/**
 * Local-processing state machine. The diff is synchronous, but the hook keeps a
 * `loading` phase so the UI stays consistent with async tools, and a run token
 * so an obsolete result is never applied after a newer submission.
 */
export function useTransactionEnvelopeDiff() {
  const [state, setState] = useState<State>({ status: "idle" });
  const runToken = useRef(0);

  function submit(left: string, right: string) {
    const parsed = validateTransactionEnvelopeDiffInput(left, right);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }

    const token = ++runToken.current;
    setState({ status: "loading" });

    try {
      const result = runTransactionEnvelopeDiff(parsed.input);
      if (token === runToken.current) {
        setState({ status: "success", result });
      }
    } catch (error) {
      if (token === runToken.current) {
        setState({ status: "error", error: toToolError(error) });
      }
    }
  }

  return { state, submit };
}
