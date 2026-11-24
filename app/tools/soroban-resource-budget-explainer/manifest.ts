import { Gauge } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "soroban-resource-budget-explainer",
  title: "Soroban Resource Budget Explainer",
  description: "Explain instruction, memory, fee, and footprint evidence from a recorded Soroban simulation.",
  character: "A clerk who reads the meter that was already printed.",
  href: "/tools/soroban-resource-budget-explainer",
  status: "MVP",
  icon: Gauge
};
