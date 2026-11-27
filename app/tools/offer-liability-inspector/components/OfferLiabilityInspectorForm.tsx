"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
export function OfferLiabilityInspectorForm({ onSubmit, busy }: { onSubmit: (value: string) => void; busy: boolean }) {
  const [value, setValue] = useState("");
  return <form onSubmit={event => { event.preventDefault(); onSubmit(value); }} className="space-y-3">
    <label htmlFor="offer-account" className="block text-sm font-bold">Public account ID</label>
    <input id="offer-account" className="w-full rounded-md border p-2" value={value} onChange={event => setValue(event.target.value)} placeholder="G…" autoComplete="off" spellCheck={false} aria-describedby="offer-account-help" />
    <p id="offer-account-help" className="text-sm text-[#68758a]">Public G… address only. The selected network is used for both reads.</p>
    <Button type="submit" disabled={busy}>{busy ? "Inspecting…" : "Inspect offers"}</Button>
  </form>;
}
