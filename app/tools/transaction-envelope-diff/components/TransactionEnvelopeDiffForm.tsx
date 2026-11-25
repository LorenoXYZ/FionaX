"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { copy } from "@/app/tools/transaction-envelope-diff/copy";

interface Props {
  onSubmit: (left: string, right: string) => void;
  loading: boolean;
}

export function TransactionEnvelopeDiffForm({ onSubmit, loading }: Props) {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(left, right);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label htmlFor="envelope-diff-left" className="text-sm font-bold text-[#4e5c73]">
          First envelope
        </label>
        <textarea
          id="envelope-diff-left"
          value={left}
          onChange={(event) => setLeft(event.target.value)}
          placeholder={copy.leftPlaceholder}
          autoComplete="off"
          spellCheck={false}
          rows={4}
          className="min-h-20 w-full rounded-md border border-[#c7d6e8] bg-white/78 px-4 py-2 font-mono text-xs text-[#172033] outline-none transition placeholder:text-[#8a98aa] focus:border-[#47a8c7] focus:ring-2 focus:ring-[#8edcf4]/35"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="envelope-diff-right" className="text-sm font-bold text-[#4e5c73]">
          Second envelope
        </label>
        <textarea
          id="envelope-diff-right"
          value={right}
          onChange={(event) => setRight(event.target.value)}
          placeholder={copy.rightPlaceholder}
          autoComplete="off"
          spellCheck={false}
          rows={4}
          className="min-h-20 w-full rounded-md border border-[#c7d6e8] bg-white/78 px-4 py-2 font-mono text-xs text-[#172033] outline-none transition placeholder:text-[#8a98aa] focus:border-[#47a8c7] focus:ring-2 focus:ring-[#8edcf4]/35"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Working..." : copy.submit}
      </Button>
    </form>
  );
}
