import { CalendarDays } from "lucide-react";
import type { ToolManifest } from "@/lib/tool-manifest";
import { copy } from "./copy";
export const manifest: ToolManifest = { slug: "claimable-balance-expiry-calendar", title: copy.title, description: copy.description, character: "A ledger guide separates certain deadlines from unknown time windows.", href: "/tools/claimable-balance-expiry-calendar", status: "Working", icon: CalendarDays };
