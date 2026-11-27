import type { Balance, CalendarRow, UnresolvedRow } from "../types";
import { deadlineOf, unresolvedReason } from "./predicate-deadlines";
export function groupBalances(balances: Balance[], nowSeconds: bigint): { known: CalendarRow[]; unresolved: UnresolvedRow[] } {
 const known: CalendarRow[] = [], unresolved: UnresolvedRow[] = [];
 for (const balance of balances) { const deadline = deadlineOf(balance.predicate); if (deadline === undefined) unresolved.push({ ...balance, reason: unresolvedReason(balance.predicate) }); else known.push({ ...balance, deadline, phase: BigInt(deadline) <= nowSeconds ? "expired" : "future" }); }
 known.sort((a,b) => BigInt(a.deadline) < BigInt(b.deadline) ? -1 : BigInt(a.deadline) > BigInt(b.deadline) ? 1 : a.id.localeCompare(b.id) || a.claimantIndex-b.claimantIndex);
 return { known, unresolved };
}
