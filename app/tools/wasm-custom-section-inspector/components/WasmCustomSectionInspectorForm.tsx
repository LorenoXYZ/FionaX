"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { copy } from "@/app/tools/wasm-custom-section-inspector/copy";

export function WasmCustomSectionInspectorForm({ onSubmit, loading }: { onSubmit: (value: string) => void; loading: boolean }) {
  const [value, setValue] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <label htmlFor="wasm-file" className="text-sm font-bold text-[#4e5c73]">{copy.fileLabel}</label>
      <input
        id="wasm-file"
        type="file"
        accept=".wasm,application/wasm"
        className="block text-sm"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const bytes = new Uint8Array(reader.result as ArrayBuffer);
            let binary = "";
            bytes.forEach((byte) => {
              binary += String.fromCharCode(byte);
            });
            setValue(btoa(binary));
          };
          reader.readAsArrayBuffer(file);
        }}
      />
      <label htmlFor="wasm-base64" className="text-sm font-bold text-[#4e5c73]">{copy.moduleLabel}</label>
      <textarea id="wasm-base64" value={value} onChange={(event) => setValue(event.target.value)} rows={6} spellCheck={false} className="w-full rounded-md border border-[#c7d6e8] bg-white/78 px-4 py-3 font-mono text-sm" />
      <Button type="submit" disabled={loading}>{loading ? copy.loading : copy.submit}</Button>
    </form>
  );
}
