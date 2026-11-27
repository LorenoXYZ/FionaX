import type { Result } from "../types";
import { copy } from "../copy";
export function ClaimableCoverage({result}:{result:Result}) {return <aside className="rounded border p-3 text-sm" aria-label="Evidence coverage"><p>Source: Horizon · {result.network} · {result.source}</p><p>{result.pagesFetched} of 5 pages; {result.recordsFetched} of 100 balance records inspected.</p>{result.complete?<p>End of claimant pages observed.</p>:<p role="status">{copy.incomplete}</p>}{result.nextCursor?<p className="break-all">Last paging token: <code>{result.nextCursor}</code></p>:null}</aside>;}
