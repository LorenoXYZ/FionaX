import { Timer } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "soroban-storage-ttl-inspector",
  title: "Soroban Storage TTL Inspector",
  description: "Show whether explicit contract storage keys are live, absent, or missing TTL evidence.",
  character: "A clerk who only counts the ledgers the record actually names.",
  href: "/tools/soroban-storage-ttl-inspector",
  status: "MVP",
  icon: Timer
};
