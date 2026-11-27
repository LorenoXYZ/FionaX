import { describe,it,expect } from "vitest";
import { validateInput } from "@/app/tools/claimable-balance-expiry-calendar/schema";
import { claimant } from "./fixtures/normal.fixture";
describe("input validation",()=>{
 it("accepts a public claimant and explicit supported network",()=>expect(validateInput(` ${claimant} `,"testnet")).toEqual({ok:true,input:{claimant,network:"testnet"}}));
 it("rejects seeds, unknown networks, and oversized input",()=>{expect(validateInput("S".repeat(56),"testnet")).toEqual({ok:false,error:"invalid_input"});expect(validateInput(claimant,"futurenet")).toEqual({ok:false,error:"invalid_input"});expect(validateInput("G".repeat(101),"mainnet")).toEqual({ok:false,error:"too_large"});});
});
