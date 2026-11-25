import { describe, expect, it } from "vitest";
import { compareCoverage } from "@/app/tools/offer-liability-inspector/lib/coverage-compare";
import { groupLiabilities } from "@/app/tools/offer-liability-inspector/lib/liability-groups";
import { decodeOffer } from "@/app/tools/offer-liability-inspector/lib/offer-pages";
import { accountId, normalAccount, normalOffers } from "./fixtures/normal.fixture";
import { missingLiabilityAccount } from "./fixtures/incomplete.fixture";
describe("coverage comparison", () => {
  const groups = groupLiabilities(normalOffers.map(o => decodeOffer(o, accountId)), normalAccount);
  it("covers matching snapshot including native reserves", () => expect(compareCoverage(groups, false).every(g => g.status === "covered")).toBe(true));
  it("reports edited-offer mismatch", () => expect(compareCoverage([{ ...groups[0], expectedSelling: groups[0].expectedSelling + 1n }], false)[0].status).toBe("mismatch"));
  it("treats truncation and missing fields as incomplete", () => { expect(compareCoverage(groups, true)[0].status).toBe("incomplete"); expect(compareCoverage(groupLiabilities([], missingLiabilityAccount), false)[0].status).toBe("incomplete"); expect(compareCoverage([{ ...groups[0], balance: undefined }], false)[0].status).toBe("incomplete"); });
});
