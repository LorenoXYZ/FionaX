import { KeyRound } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "signer-quorum-simulator",
  title: "Signer Quorum Simulator",
  description: "Check whether a chosen subset of account signers reaches the low, medium, and high thresholds.",
  character: "A cautious co-signer who tallies every weight twice before calling a quorum.",
  href: "/tools/signer-quorum-simulator",
  status: "MVP",
  icon: KeyRound
};
