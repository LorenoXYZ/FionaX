import { ListFilter } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "soroban-event-filter-builder",
  title: "Soroban Event Filter Builder",
  description: "Build a bounded getEvents filter from contract IDs, typed topics, and an explicit ledger range.",
  character: "A clerk who writes the exact event query and leaves blank boxes blank.",
  href: "/tools/soroban-event-filter-builder",
  status: "MVP",
  icon: ListFilter
};
