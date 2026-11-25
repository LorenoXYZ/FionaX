import { horizonUrls } from "@/lib/stellar/horizon";
import { InspectorFailure, type HorizonAccount, type InspectorInput, type InspectorResult } from "../types";
import { loadOffers, type OfferLoader } from "./offer-pages";
import { groupLiabilities } from "./liability-groups";
import { compareCoverage } from "./coverage-compare";
export interface InspectorDeps { loadAccount: (accountId: string, signal?: AbortSignal) => Promise<HorizonAccount>; loadPage: OfferLoader }
async function getJson(url: URL, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw { status: response.status };
  return response.json();
}
function defaultDeps(input: InspectorInput): InspectorDeps {
  const { network, accountId } = input;
  return {
    loadAccount: async (id, signal) => getJson(new URL(`/accounts/${encodeURIComponent(id)}`, horizonUrls[network]), signal) as Promise<HorizonAccount>,
    loadPage: async (cursor, signal) => {
      const url = new URL(`/accounts/${encodeURIComponent(accountId)}/offers`, horizonUrls[network]);
      url.searchParams.set("limit", "20");
      if (cursor) url.searchParams.set("cursor", cursor);
      const body = await getJson(url, signal);
      if (!body || typeof body !== "object" || !("_embedded" in body) || !Array.isArray((body as { _embedded?: { records?: unknown } })._embedded?.records)) throw new InspectorFailure("malformed_data", "Offers response is missing records.");
      return { records: (body as { _embedded: { records: [] } })._embedded.records };
    }
  };
}
export async function runInspector(input: InspectorInput, deps?: InspectorDeps, signal?: AbortSignal): Promise<InspectorResult> {
  const provider = deps ?? defaultDeps(input);
  const account = await provider.loadAccount(input.accountId, signal);
  if (!account || account.id !== input.accountId) throw new InspectorFailure("malformed_data", "Account response does not match requested account.");
  const { offers, pages, truncated } = await loadOffers(input.accountId, provider.loadPage, signal);
  const groups = compareCoverage(groupLiabilities(offers, account), truncated);
  const notes = [];
  if (truncated) notes.push("Offer history reaches the 100-offer or five-page bound; totals cannot prove full coverage.");
  if (groups.some(group => group.status === "incomplete")) notes.push("A balance or liability field is missing; coverage is incomplete.");
  notes.push("Native XLM reserve spendability is not asserted: the account and offers endpoints do not supply the network's current base reserve.");
  notes.push("Current offers only: edits or cancellations between account and offers reads can cause a mismatch.");
  return { ...input, offers, groups, pages, truncated, incomplete: groups.some(group => group.status === "incomplete") || truncated, notes };
}
