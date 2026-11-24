import { formatSize } from "@/app/tools/wasm-custom-section-inspector/lib/format";
import type { WasmSectionView } from "@/app/tools/wasm-custom-section-inspector/types";

export function WasmSectionRows({ sections }: { sections: WasmSectionView[] }) {
  return (
    <ul className="space-y-1">
      {sections.map((section) => (
        <li key={section.index} className="text-sm text-[#172033]">
          {section.index}. {section.name ?? `section ${section.id}`} · {formatSize(section.size)}
        </li>
      ))}
    </ul>
  );
}
