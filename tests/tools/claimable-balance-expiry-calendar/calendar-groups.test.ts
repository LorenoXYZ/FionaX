import { it,expect } from "vitest";
import { groupBalances } from "@/app/tools/claimable-balance-expiry-calendar/lib/calendar-groups";
import type { Balance } from "@/app/tools/claimable-balance-expiry-calendar/types";
const base:Balance={id:"a".repeat(72),pagingToken:"1",asset:"native",amount:"1",claimant:"G",claimantIndex:0,predicate:{kind:"absolute",seconds:"20"}};
it("sorts expired and future deadlines while keeping claimant entries separate",()=>{const result=groupBalances([{...base,predicate:{kind:"absolute",seconds:"30"}},{...base,claimantIndex:1,predicate:{kind:"absolute",seconds:"10"}},{...base,claimantIndex:2,predicate:{kind:"relative",seconds:"20"}}],20n);expect(result.known.map(x=>[x.deadline,x.phase,x.claimantIndex])).toEqual([["10","expired",1],["30","future",0]]);expect(result.unresolved).toHaveLength(1);});
