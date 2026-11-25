"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "@/app/tools/signer-quorum-simulator/copy";

interface Props {
  onSubmit: (accountJson: string, selection: string) => void;
  loading: boolean;
}

export function SignerQuorumSimulatorForm({ onSubmit, loading }: Props) {
  const [accountJson, setAccountJson] = useState("");
  const [selection, setSelection] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(accountJson, selection);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label htmlFor="signer-quorum-account-json" className="text-sm font-bold text-[#4e5c73]">
          Account JSON
        </label>
        <textarea
          id="signer-quorum-account-json"
          value={accountJson}
          onChange={(event) => setAccountJson(event.target.value)}
          placeholder={copy.accountPlaceholder}
          autoComplete="off"
          spellCheck={false}
          rows={6}
          className="min-h-24 w-full rounded-md border border-[#c7d6e8] bg-white/78 px-4 py-2 font-mono text-xs text-[#172033] outline-none transition placeholder:text-[#8a98aa] focus:border-[#47a8c7] focus:ring-2 focus:ring-[#8edcf4]/35"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="signer-quorum-selection" className="text-sm font-bold text-[#4e5c73]">
          Selected signer keys
        </label>
        <Input
          id="signer-quorum-selection"
          value={selection}
          onChange={(event) => setSelection(event.target.value)}
          placeholder={copy.selectionPlaceholder}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Working..." : copy.submit}
      </Button>
    </form>
  );
}
