import type { Input, Outcome } from "../types";
import { validateInput } from "../schema";
import { loadClaimablePages } from "./claimable-pages";
import { groupBalances } from "./calendar-groups";
import { toCalendarError } from "./claimableBalanceExpiryCalendar.errors";
export async function runClaimableBalanceExpiryCalendar(input: Input, fetchImpl: typeof fetch = fetch, nowSeconds: bigint = BigInt(Math.floor(Date.now()/1000)), signal?: AbortSignal): Promise<Outcome> {
 const parsed=validateInput(input.claimant,input.network); if (!parsed.ok) return {ok:false,error:parsed.error};
 try { const page=await loadClaimablePages(parsed.input,fetchImpl,signal); return {ok:true,result:{network:parsed.input.network,claimant:parsed.input.claimant,...page,...groupBalances(page.balances,nowSeconds)}}; } catch(error) {return {ok:false,error:toCalendarError(error)};}
}
