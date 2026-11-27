import { InspectorFailure, type HorizonOffer, type OfferEvidence } from "../types";
import { amountToStroops, assetFromWire, parseRatio } from "./format";
export interface OfferPage { records: HorizonOffer[] }
export interface OfferLoader { (cursor?: string, signal?: AbortSignal): Promise<OfferPage> }
export function decodeOffer(raw: HorizonOffer, accountId: string): OfferEvidence {
  const id = typeof raw?.id === "number" && Number.isSafeInteger(raw.id) ? String(raw.id) : raw?.id;
  if (!raw || typeof raw !== "object" || typeof id !== "string" || !/^[1-9]\d{0,19}$/.test(id) || BigInt(id) > 9223372036854775807n || raw.seller !== accountId) throw new InspectorFailure("malformed_data", "Invalid offer ID or seller.");
  const selling = assetFromWire(raw.selling), buying = assetFromWire(raw.buying);
  if (selling.key === buying.key) throw new InspectorFailure("malformed_data", "Offer buys and sells the same asset.");
  const amount = amountToStroops(raw.amount), { n, d } = parseRatio(raw.price_r);
  if (amount === 0n) throw new InspectorFailure("malformed_data", "Zero-amount offers are not active offers.");
  return { id, selling, buying, amount, priceN: n, priceD: d, buyingAmount: (amount * n + d - 1n) / d };
}
export async function loadOffers(accountId: string, loader: OfferLoader, signal?: AbortSignal): Promise<{ offers: OfferEvidence[]; pages: number; truncated: boolean }> {
  const offers: OfferEvidence[] = [], ids = new Set<string>(), cursors = new Set<string>();
  let cursor: string | undefined, pages = 0, truncated = false;
  for (let page = 0; page < 5; page++) {
    const response = await loader(cursor, signal);
    if (!response || !Array.isArray(response.records) || response.records.length > 20) throw new InspectorFailure("malformed_data", "Invalid or oversized offers page.");
    pages++;
    for (const raw of response.records) { const offer = decodeOffer(raw, accountId); if (!ids.has(offer.id)) { ids.add(offer.id); offers.push(offer); } }
    if (response.records.length < 20) break;
    const last = response.records[response.records.length - 1];
    if (typeof last.paging_token !== "string" || !/^\d{1,20}$/.test(last.paging_token) || cursors.has(last.paging_token)) throw new InspectorFailure("malformed_data", "Invalid offers pagination cursor.");
    cursors.add(last.paging_token); cursor = last.paging_token;
    if (page === 4) truncated = true;
  }
  return { offers, pages, truncated };
}
