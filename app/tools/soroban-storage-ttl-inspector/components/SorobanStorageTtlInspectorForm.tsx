"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { copy } from "@/app/tools/soroban-storage-ttl-inspector/copy";

export function SorobanStorageTtlInspectorForm({ onSubmit, loading }: { onSubmit: (value: string) => void; loading: boolean }) {
  const [value, setValue] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <label htmlFor="ttl-keys" className="text-sm font-bold text-[#4e5c73]">{copy.keysLabel}</label>
      <textarea id="ttl-keys" value={value} onChange={(event) => setValue(event.target.value)} rows={10} spellCheck={false} className="w-full rounded-md border border-[#c7d6e8] bg-white/78 px-4 py-3 font-mono text-sm" />
      <Button type="submit" disabled={loading}>{loading ? copy.loading : copy.submit}</Button>
    </form>
  );
}
