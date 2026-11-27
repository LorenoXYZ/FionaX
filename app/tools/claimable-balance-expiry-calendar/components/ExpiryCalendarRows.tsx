import type { CalendarRow } from "../types";
import { copy } from "../copy";
import { formatAmount,formatDeadline,formatIdentity } from "../lib/format";
export function ExpiryCalendarRows({rows}:{rows:CalendarRow[]}) {return <section aria-label={copy.known}><h2 className="font-semibold">{copy.known}</h2><ul className="space-y-3">{rows.map(row=><li key={`${row.id}:${row.claimantIndex}`} className="rounded border p-3 text-sm"><strong>{formatDeadline(row.deadline)} · {row.phase}</strong><p>Balance <code className="break-all">{formatIdentity(row.id)}</code> · claimant #{row.claimantIndex+1}</p><p>{row.asset} · {formatAmount(row.amount)}</p></li>)}</ul></section>;}
