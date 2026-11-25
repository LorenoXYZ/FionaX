"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "../copy";
export function ClaimableBalanceExpiryCalendarForm({onSubmit,loading}:{onSubmit:(value:string)=>void;loading:boolean}) {
 const [value,setValue]=useState(""); return <form className="space-y-4" onSubmit={event=>{event.preventDefault();onSubmit(value);}}><label className="block space-y-2"><span className="text-sm font-medium">{copy.label}</span><Input value={value} onChange={event=>setValue(event.target.value)} placeholder="G…" autoComplete="off" spellCheck={false} required aria-describedby="calendar-input-help" /></label><p id="calendar-input-help" className="text-sm">Public G address only. The selected network is shown above.</p><Button type="submit" disabled={loading}>{loading?copy.loading:copy.submit}</Button></form>;
}
