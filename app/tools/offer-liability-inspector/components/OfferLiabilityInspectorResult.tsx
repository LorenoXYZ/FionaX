import type { InspectorResult } from "../types";
import { OfferCoverageNotice } from "./OfferCoverageNotice";
import { OfferLiabilityRows } from "./OfferLiabilityRows";
import { LiabilityCoverageTotals } from "./LiabilityCoverageTotals";
export function OfferLiabilityInspectorResult({ result }: { result: InspectorResult }) { return <div className="space-y-5"><h2 className="font-bold">{result.network}: {result.accountId}</h2><p className="text-sm">Read {result.pages} offers page(s).</p><OfferCoverageNotice result={result} /><LiabilityCoverageTotals groups={result.groups} /><OfferLiabilityRows offers={result.offers} /></div>; }
