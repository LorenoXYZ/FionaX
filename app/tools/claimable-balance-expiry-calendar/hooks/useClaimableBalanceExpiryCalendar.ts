"use client";
import { useEffect, useRef, useState } from "react";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import type { Result, ErrorCode } from "../types";
import { runClaimableBalanceExpiryCalendar } from "../lib/claimableBalanceExpiryCalendar";
import { validateInput } from "../schema";
type State = { status:"idle" } | {status:"loading"} | {status:"success";result:Result} | {status:"error";error:ErrorCode};
export function useClaimableBalanceExpiryCalendar(network: StellarNetwork) {
 const [state,setState]=useState<State>({status:"idle"}); const active=useRef<AbortController|null>(null);
 useEffect(()=>()=>active.current?.abort(),[]);
 async function submit(claimant:string) { active.current?.abort(); const parsed=validateInput(claimant,network); if(!parsed.ok){setState({status:"error",error:parsed.error});return;} const controller=new AbortController(); active.current=controller; setState({status:"loading"}); const outcome=await runClaimableBalanceExpiryCalendar(parsed.input,fetch,BigInt(Math.floor(Date.now()/1000)),controller.signal); if(active.current!==controller || controller.signal.aborted)return; setState(outcome.ok?{status:"success",result:outcome.result}:{status:"error",error:outcome.error}); }
 return {state,submit};
}
