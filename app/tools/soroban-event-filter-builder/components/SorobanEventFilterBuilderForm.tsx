"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { copy } from "@/app/tools/soroban-event-filter-builder/copy";

export function SorobanEventFilterBuilderForm({ onSubmit, loading }: { onSubmit: (value: string) => void; loading: boolean }) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
      className="space-y-4"
    >
      <label htmlFor="event-filter-json" className="text-sm font-bold text-[#4e5c73]">
        {copy.filterLabel}
      </label>
      <textarea
        id="event-filter-json"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={10}
        spellCheck={false}
        className="min-h-40 w-full rounded-md border border-[#c7d6e8] bg-white/78 px-4 py-3 font-mono text-sm text-[#172033]"
      />
      <Button type="submit" disabled={loading}>
        {loading ? copy.loading : copy.submit}
      </Button>
    </form>
  );
}
