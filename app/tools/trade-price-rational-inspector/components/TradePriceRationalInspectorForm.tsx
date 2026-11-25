"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
interface Props { onSubmit: (raw: string) => void; onReset: () => void; loading: boolean; error?: string }
export function TradePriceRationalInspectorForm({ onSubmit, onReset, loading, error }: Props) {
  const [value, setValue] = useState("");
  return <form onSubmit={(event) => { event.preventDefault(); onSubmit(value); }} className="space-y-3">
    <label htmlFor="trade-json" className="block text-sm font-bold">Horizon trade JSON</label>
    <textarea id="trade-json" value={value} onChange={(event) => setValue(event.target.value)} aria-describedby="trade-json-help trade-json-error" aria-invalid={!!error} spellCheck={false} autoComplete="off" rows={9} className="w-full rounded-md border border-[#cfe0ea] bg-white p-3 font-mono text-xs" placeholder='[{"id":"123-0","base_amount":"1.0000000",...}]' />
    <p id="trade-json-help" className="text-xs text-[#68758a]">Local processing only. Maximum 100 records and 256,000 characters. Do not paste a secret seed.</p>
    {error && <p id="trade-json-error" className="text-sm text-red-700">{error}</p>}
    <div className="flex gap-3"><Button type="submit" disabled={loading}>{loading ? "Comparing…" : "Inspect trades"}</Button><Button type="button" onClick={() => { setValue(""); onReset(); }}>Reset</Button></div>
  </form>;
}
