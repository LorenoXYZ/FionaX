import { FileSearch } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "wasm-custom-section-inspector",
  title: "Wasm Custom Section Inspector",
  description: "Read Soroban environment, spec, and publisher metadata from a local Wasm file without executing it.",
  character: "A clerk who opens the label and never runs the machine.",
  href: "/tools/wasm-custom-section-inspector",
  status: "MVP",
  icon: FileSearch
};
