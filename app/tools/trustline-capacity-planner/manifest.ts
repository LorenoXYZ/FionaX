import { ArrowDownToLine } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "trustline-capacity-planner",
  title: "Trustline Receiving Capacity Planner",
  description: "Calculate how much more a trustline can receive after its balance, limit, and liabilities.",
  character: "A careful clerk checks how much more a vault can accept before anyone adds to it.",
  href: "/tools/trustline-capacity-planner",
  status: "MVP",
  icon: ArrowDownToLine
};
