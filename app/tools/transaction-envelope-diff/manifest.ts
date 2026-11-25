import { GitCompareArrows } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "transaction-envelope-diff",
  title: "Transaction Envelope Semantic Diff",
  description: "Compare two transaction envelopes semantically and show what changed in sources, memo, operations, and signatures.",
  character: "A ledger auditor who spots a re-signature from a real payment change at a glance.",
  href: "/tools/transaction-envelope-diff",
  status: "MVP",
  icon: GitCompareArrows
};
