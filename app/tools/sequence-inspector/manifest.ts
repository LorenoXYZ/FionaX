import { Hash } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";

export const manifest: ToolManifest = {
  slug: "sequence-inspector",
  title: "Account Sequence Number Inspector",
  description: "Show an account's current sequence number and the next valid sequence number for a new transaction.",
  character: "A ledger clerk who never lets a transaction jump the queue.",
  href: "/tools/sequence-inspector",
  status: "MVP",
  icon: Hash
};
