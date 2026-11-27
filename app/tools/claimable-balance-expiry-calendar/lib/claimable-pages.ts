import { StrKey } from "@stellar/stellar-sdk";
import { horizonUrls } from "@/lib/stellar/horizon";
import { CalendarFailure, type Balance, type Input } from "../types";
import { decodePredicate } from "./predicate-deadlines";
const PAGE_SIZE = 20, MAX_PAGES = 5;
function record(v: unknown): Record<string, unknown> { if (!v || typeof v !== "object" || Array.isArray(v)) throw new CalendarFailure("malformed_data"); return v as Record<string, unknown>; }
function decode(raw: unknown, claimant: string): Balance[] {
 const v = record(raw);
 if (typeof v.id !== "string" || !/^[0-9a-f]{72}$/i.test(v.id) || typeof v.paging_token !== "string" || !/^(?:[0-9]{1,40}|[0-9a-f]{72})$/i.test(v.paging_token) || typeof v.asset !== "string" || !(v.asset === "native" || /^[A-Za-z0-9]{1,12}:G[A-Z2-7]{55}$/.test(v.asset) && StrKey.isValidEd25519PublicKey(v.asset.split(":")[1])) || typeof v.amount !== "string" || !/^(0|[1-9][0-9]{0,19})(\.[0-9]{1,7})?$/.test(v.amount) || !Array.isArray(v.claimants) || v.claimants.length > 10) throw new CalendarFailure("malformed_data");
 const [whole, fraction=""] = v.amount.split("."); const stroops = BigInt(whole)*10000000n+BigInt(fraction.padEnd(7,"0"));
 if (stroops <= 0n || stroops > 9223372036854775807n) throw new CalendarFailure("malformed_data");
 const out: Balance[] = [];
 v.claimants.forEach((claimantRaw, claimantIndex) => { const entry = record(claimantRaw); if (typeof entry.destination !== "string" || !StrKey.isValidEd25519PublicKey(entry.destination)) throw new CalendarFailure("malformed_data"); if (entry.destination === claimant) out.push({ id: v.id as string, pagingToken: v.paging_token as string, asset: v.asset as string, amount: v.amount as string, claimant, claimantIndex, predicate: decodePredicate(entry.predicate) }); });
 if (!out.length) throw new CalendarFailure("malformed_data");
 return out;
}
export async function loadClaimablePages(input: Input, fetchImpl: typeof fetch = fetch, signal?: AbortSignal): Promise<{ balances: Balance[]; pagesFetched: number; recordsFetched: number; complete: boolean; nextCursor?: string; source: string }> {
 const source = horizonUrls[input.network]; const seen = new Set<string>(), balances: Balance[] = []; let cursor: string | undefined, pagesFetched=0, recordsFetched=0, complete=false;
 for (let page=0; page<MAX_PAGES; page++) {
  const url = new URL("/claimable_balances", source); url.searchParams.set("claimant",input.claimant); url.searchParams.set("limit",String(PAGE_SIZE)); url.searchParams.set("order","asc"); if(cursor) url.searchParams.set("cursor",cursor);
  let response: Response; try { response = await fetchImpl(url.toString(), { signal }); } catch { throw new CalendarFailure("request_failed"); }
  if (response.status === 429) throw new CalendarFailure("rate_limited"); if (response.status === 404) throw new CalendarFailure("not_found"); if (!response.ok) throw new CalendarFailure("request_failed");
  let body: Record<string, unknown>; try { body=record(await response.json()); } catch { throw new CalendarFailure("malformed_data"); }
  const records = record(body._embedded).records; if (!Array.isArray(records)) throw new CalendarFailure("malformed_data"); if (records.length>PAGE_SIZE) throw new CalendarFailure("too_large");
  for (const raw of records) { const rows=decode(raw,input.claimant); const key=rows[0].id; if (!seen.has(key)) { seen.add(key); balances.push(...rows); } }
  pagesFetched++; recordsFetched+=records.length;
  if (records.length<PAGE_SIZE) { complete=true; cursor=undefined; break; }
  const last=record(records.at(-1)).paging_token as string; if (cursor && BigInt(last.length===72?`0x${last}`:last) <= BigInt(cursor.length===72?`0x${cursor}`:cursor)) throw new CalendarFailure("malformed_data"); cursor=last;
 }
 return { balances, pagesFetched, recordsFetched, complete, ...(cursor?{nextCursor:cursor}:{}), source };
}
