import { describe,it,expect } from "vitest";
import { decodePredicate,deadlineOf,unresolvedReason } from "@/app/tools/claimable-balance-expiry-calendar/lib/predicate-deadlines";
describe("predicate deadlines",()=>{
 it("decodes absolute epoch and matching ISO context",()=>{expect(deadlineOf(decodePredicate({absBeforeEpoch:"1893456000"}))).toBe("1893456000");expect(deadlineOf(decodePredicate({absBefore:"2030-01-01T00:00:00Z",absBeforeEpoch:"1893456000"}))).toBe("1893456000");});
 it("leaves relative, unconditional, and compound predicates unresolved",()=>{const relative=decodePredicate({relBefore:"3600"});expect(deadlineOf(relative)).toBeUndefined();expect(unresolvedReason(relative)).toMatch(/creation time/);expect(deadlineOf(decodePredicate({unconditional:true}))).toBeUndefined();expect(deadlineOf(decodePredicate({and:[{absBeforeEpoch:"1893456000"},{relBefore:"3600"}]}))).toBeUndefined();});
 it("fails malformed and unknown variants",()=>{expect(()=>decodePredicate({absBefore:"2030-01-01T00:00:00Z",absBeforeEpoch:"1"})).toThrow();expect(()=>decodePredicate({relBefore:"-1"})).toThrow();expect(()=>decodePredicate({laterThan:"1"})).toThrow();expect(()=>decodePredicate({absBefore:"2030-02-30T00:00:00Z"})).toThrow();});
});
