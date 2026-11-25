import { describe,it,expect,vi } from "vitest";
import { loadClaimablePages } from "@/app/tools/claimable-balance-expiry-calendar/lib/claimable-pages";
import { claimant,balance,response } from "./fixtures/normal.fixture";
import { pageOf20 } from "./fixtures/boundary.fixture";
import { fiveFullPages } from "./fixtures/incomplete.fixture";
import { missingPredicate,unknownPredicate,oversizedAmount } from "./fixtures/malformed.fixture";
const input={claimant,network:"testnet" as const};
describe("bounded Horizon pages",()=>{
 it("fetches one valid page with claimant filter and selected network",async()=>{const fetcher=vi.fn(async(url:string)=>{expect(url).toContain("horizon-testnet.stellar.org/claimable_balances");expect(url).toContain(`claimant=${claimant}`);return response([balance]);});const result=await loadClaimablePages(input,fetcher as typeof fetch);expect(result.balances).toHaveLength(1);expect(result.complete).toBe(true);expect(fetcher).toHaveBeenCalledOnce();});
 it("maps not-found and failed responses",async()=>{await expect(loadClaimablePages(input,vi.fn(async()=>response([],404)) as typeof fetch)).rejects.toMatchObject({code:"not_found"});await expect(loadClaimablePages(input,vi.fn(async()=>response([],503)) as typeof fetch)).rejects.toMatchObject({code:"request_failed"});});
 it("deduplicates overlapping pages by balance identity",async()=>{let call=0;const fetcher=vi.fn(async()=>response(call++===0?pageOf20:[pageOf20[19]]));const result=await loadClaimablePages(input,fetcher as typeof fetch);expect(result.balances).toHaveLength(20);expect(result.pagesFetched).toBe(2);});
 it("stops at 100 records and marks evidence incomplete",async()=>{let call=0;const fetcher=vi.fn(async()=>response(fiveFullPages[call++]));const result=await loadClaimablePages(input,fetcher as typeof fetch);expect(result.balances).toHaveLength(100);expect(result.complete).toBe(false);expect(result.nextCursor).toBe("100");expect(fetcher).toHaveBeenCalledTimes(5);});
 it("rejects too-large and malformed provider records",async()=>{await expect(loadClaimablePages(input,vi.fn(async()=>response([...pageOf20,balance])) as typeof fetch)).rejects.toMatchObject({code:"too_large"});for(const records of [[missingPredicate],[oversizedAmount]]) await expect(loadClaimablePages(input,vi.fn(async()=>response(records)) as typeof fetch)).rejects.toMatchObject({code:"malformed_data"});});
 it("rejects unknown predicate and rate limits with precise codes",async()=>{await expect(loadClaimablePages(input,vi.fn(async()=>response([unknownPredicate])) as typeof fetch)).rejects.toMatchObject({code:"unsupported_variant"});await expect(loadClaimablePages(input,vi.fn(async()=>response([],429)) as typeof fetch)).rejects.toMatchObject({code:"rate_limited"});});
 it("rejects a repeated full page cursor",async()=>{const fetcher=vi.fn(async()=>response(pageOf20));await expect(loadClaimablePages(input,fetcher as typeof fetch)).rejects.toMatchObject({code:"malformed_data"});expect(fetcher).toHaveBeenCalledTimes(2);});
 it("keeps matching entries of the same balance separate",async()=>{const dual={...balance,claimants:[balance.claimants[0],{destination:claimant,predicate:{relBefore:"60"}}]};const result=await loadClaimablePages(input,vi.fn(async()=>response([dual])) as typeof fetch);expect(result.balances.map(x=>x.claimantIndex)).toEqual([0,1]);});
});
