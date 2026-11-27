import type { UnresolvedRow } from "../types";
import { copy } from "../copy";
import { formatIdentity } from "../lib/format";
export function UnresolvedPredicateRows({rows}:{rows:UnresolvedRow[]}) {return <section aria-label={copy.unresolved}><h2 className="font-semibold">{copy.unresolved}</h2><ul className="space-y-3">{rows.map(row=><li key={`${row.id}:${row.claimantIndex}`} className="rounded border p-3 text-sm"><p>{row.reason}</p><p>Balance <code className="break-all">{formatIdentity(row.id)}</code> · claimant #{row.claimantIndex+1}</p></li>)}</ul></section>;}
