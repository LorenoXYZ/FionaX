"use client";
import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useNetwork } from "@/components/stellar/NetworkProvider";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import { copy } from "../copy";
import { useClaimableBalanceExpiryCalendar } from "../hooks/useClaimableBalanceExpiryCalendar";
import { ClaimableBalanceExpiryCalendarForm } from "./ClaimableBalanceExpiryCalendarForm";
import { ClaimableBalanceExpiryCalendarEmptyState } from "./ClaimableBalanceExpiryCalendarEmptyState";
import { ClaimableBalanceExpiryCalendarResult } from "./ClaimableBalanceExpiryCalendarResult";
export function ClaimableBalanceExpiryCalendarPanel(){const {network}=useNetwork();return <Content key={network} network={network}/>;}
function Content({network}:{network:StellarNetwork}){const {state,submit}=useClaimableBalanceExpiryCalendar(network);return <div className="mx-auto max-w-3xl space-y-6"><CharacterPanel tone="star" eyebrow={network} title={copy.title} description={copy.description}/><Card className="space-y-5"><ClaimableBalanceExpiryCalendarForm onSubmit={submit} loading={state.status==="loading"}/><div aria-live="polite">{state.status==="idle"?<ClaimableBalanceExpiryCalendarEmptyState/>:null}{state.status==="loading"?<p role="status">{copy.loading}</p>:null}{state.status==="error"?<StatusMessage type="error" title={copy.errorTitle} description={copy.errors[state.error]}/>:null}{state.status==="success"?<ClaimableBalanceExpiryCalendarResult result={state.result}/>:null}</div></Card></div>;}
