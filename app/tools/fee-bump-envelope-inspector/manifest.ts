import { ScanSearch } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";
export const manifest: ToolManifest = {
  slug: "fee-bump-envelope-inspector", title: "Fee-Bump Envelope Inspector",
  description: "Decode outer and inner fee-bump transaction layers and hashes locally for a supplied network.",
  character: "A transaction archivist who keeps both signatures in their proper layer.",
  href: "/tools/fee-bump-envelope-inspector", status: "MVP", icon: ScanSearch
};
