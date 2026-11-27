import type { Result } from "../types";
import { copy } from "../copy";
import { ClaimableCoverage } from "./ClaimableCoverage";
import { ExpiryCalendarRows } from "./ExpiryCalendarRows";
import { UnresolvedPredicateRows } from "./UnresolvedPredicateRows";
export function ClaimableBalanceExpiryCalendarResult({result}:{result:Result}) {return <section className="space-y-4" aria-label="Expiry calendar result"><ClaimableCoverage result={result}/>{result.known.length+result.unresolved.length===0?<p>{copy.empty}</p>:null}{result.known.length?<ExpiryCalendarRows rows={result.known}/>:null}{result.unresolved.length?<UnresolvedPredicateRows rows={result.unresolved}/>:null}</section>;}
