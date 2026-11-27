import { describe, expect, it } from "vitest";
import { groupLiabilities } from "@/app/tools/offer-liability-inspector/lib/liability-groups";
import { decodeOffer } from "@/app/tools/offer-liability-inspector/lib/offer-pages";
import { accountId, normalAccount, normalOffers, usdA, usdB } from "./fixtures/normal.fixture";
import { missingLiabilityAccount } from "./fixtures/incomplete.fixture";
describe("per-asset evidence", () => {
  it("keeps equal codes with distinct issuers separate", () => { const groups = groupLiabilities(normalOffers.map(o => decodeOffer(o, accountId)), normalAccount); expect(groups).toHaveLength(3); expect(groups.find(g => g.asset.key.includes(usdA.asset_issuer))?.expectedBuying).toBe(30000000n); expect(groups.find(g => g.asset.key.includes(usdB.asset_issuer))?.expectedSelling).toBe(10000000n); });
  it("does not invent unavailable liability fields", () => expect(groupLiabilities([], missingLiabilityAccount)[0].declaredSelling).toBeUndefined());
  it("does not invent unavailable balances", () => expect(groupLiabilities([], { id: accountId, balances: [{ asset_type: "native", selling_liabilities: "0", buying_liabilities: "0" }] })[0].balance).toBeUndefined());
  it("rejects missing balances", () => expect(() => groupLiabilities([], { id: accountId })).toThrow());
});
