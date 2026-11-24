import type { StorageEntryResult } from "@/app/tools/soroban-storage-ttl-inspector/types";

export function StorageEntryRows({ entries }: { entries: StorageEntryResult[] }) {
  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li key={entry.id} className="text-sm text-[#172033]">
          <span className="font-bold">{entry.id}</span> {entry.status} {entry.requestedDurability}
          {entry.entryDurability ? ` / entry ${entry.entryDurability}` : ""}
        </li>
      ))}
    </ul>
  );
}
