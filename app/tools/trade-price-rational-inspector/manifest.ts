import { Scale } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";
export const manifest: ToolManifest = {
  slug: "trade-price-rational-inspector",
  title: "Trade Price Rational Inspector",
  description: "Compare pasted Horizon trade amounts with rational offer prices, offline and without rounding away evidence.",
  character: "A ledger auditor who counts every stroop.",
  href: "/tools/trade-price-rational-inspector",
  status: "MVP",
  icon: Scale
};
