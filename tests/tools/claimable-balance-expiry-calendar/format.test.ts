import { it,expect } from "vitest";
import { formatAmount,formatIdentity,formatDeadline } from "@/app/tools/claimable-balance-expiry-calendar/lib/format";
it("keeps large amounts and full identifiers exact",()=>{expect(formatAmount("922337203685.4775807")).toBe("922337203685.4775807");expect(formatIdentity("a".repeat(72))).toHaveLength(72);expect(formatDeadline("1893456000")).toBe("2030-01-01T00:00:00 UTC");});
