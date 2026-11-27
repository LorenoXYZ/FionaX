"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
interface Props { onSubmit: (envelope: string, passphrase: string) => void; onReset: () => void; loading: boolean }
export function FeeBumpEnvelopeInspectorForm({ onSubmit, onReset, loading }: Props) {
  const [envelope, setEnvelope] = useState("");
  const [passphrase, setPassphrase] = useState("");
  function reset() { setEnvelope(""); setPassphrase(""); onReset(); }
  return <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(envelope, passphrase); }}>
    <div className="space-y-2"><label htmlFor="fee-envelope" className="block text-sm font-bold">Base64 transaction envelope</label>
      <textarea id="fee-envelope" rows={5} value={envelope} onChange={(event) => setEnvelope(event.target.value)} autoComplete="off" spellCheck={false} maxLength={90000} aria-describedby="fee-envelope-help" className="w-full rounded-md border border-[#c7d6e8] p-3 font-mono text-xs" />
      <p id="fee-envelope-help" className="text-xs text-[#68758a]">Fee-bump XDR only; maximum decoded size 64 KiB.</p></div>
    <div className="space-y-2"><label htmlFor="fee-network" className="block text-sm font-bold">Network passphrase</label>
      <input id="fee-network" value={passphrase} onChange={(event) => setPassphrase(event.target.value)} autoComplete="off" spellCheck={false} maxLength={257} className="w-full rounded-md border border-[#c7d6e8] p-3 text-sm" />
      <p className="text-xs text-[#68758a]">Enter the exact passphrase; hashes change with the network.</p></div>
    <div className="flex gap-3"><Button type="submit" disabled={loading}>{loading ? "Inspecting…" : "Inspect envelope"}</Button><Button type="button" onClick={reset}>Reset</Button></div>
  </form>;
}
