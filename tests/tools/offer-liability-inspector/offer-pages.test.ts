import { describe, expect, it } from "vitest";
import { decodeOffer, loadOffers } from "@/app/tools/offer-liability-inspector/lib/offer-pages";
import { accountId, normalOffers } from "./fixtures/normal.fixture";
import { fullPage } from "./fixtures/boundary.fixture";
import { missingRatio } from "./fixtures/malformed.fixture";
describe("bounded offer pages", () => {
  it("rounds buying liability up and preserves full offer ID", () => { const offer = decodeOffer(normalOffers[1], accountId); expect(offer.buyingAmount).toBe(3333334n); expect(decodeOffer(normalOffers[0], accountId).id).toBe("9223372036854775807"); });
  it("deduplicates repeated offers", async () => { const result = await loadOffers(accountId, async () => ({ records: [normalOffers[0], normalOffers[0]] })); expect(result.offers).toHaveLength(1); });
  it("marks five full pages truncated", async () => { const result = await loadOffers(accountId, async cursor => ({ records: fullPage(cursor ? Number(cursor) : 0) })); expect(result.offers).toHaveLength(100); expect(result.truncated).toBe(true); expect(result.pages).toBe(5); });
  it("rejects malformed records and oversized pages", async () => { await expect(loadOffers(accountId, async () => ({ records: [missingRatio] }))).rejects.toThrow(); await expect(loadOffers(accountId, async () => ({ records: [...fullPage(0), normalOffers[0]] }))).rejects.toThrow(); });
});
