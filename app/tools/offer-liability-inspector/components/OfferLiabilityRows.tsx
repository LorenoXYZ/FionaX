import type { OfferEvidence } from "../types";
import { formatAmount } from "../lib/format";
export function OfferLiabilityRows({ offers }: { offers: OfferEvidence[] }) {
  return <section className="space-y-2"><h3 className="font-bold">Offer evidence ({offers.length})</h3>{offers.length === 0 ? <p>No open offers were returned.</p> : <ul className="space-y-2">{offers.map(offer => <li key={offer.id} className="break-all rounded border p-2 text-sm">Offer {offer.id}: sells {formatAmount(offer.amount)} {offer.selling.label}; buys up to {formatAmount(offer.buyingAmount)} {offer.buying.label} at {offer.priceN.toString()}/{offer.priceD.toString()}</li>)}</ul>}</section>;
}
