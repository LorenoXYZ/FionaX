import { describe, expect, it, vi } from "vitest";
import { runInspector } from "@/app/tools/offer-liability-inspector/lib/offerLiabilityInspector";
import { errorCode } from "@/app/tools/offer-liability-inspector/lib/offerLiabilityInspector.errors";
import { accountId, normalAccount, normalOffers } from "./fixtures/normal.fixture";
import { emptyAccount, missingLiabilityAccount } from "./fixtures/incomplete.fixture";
import { editedOffer } from "./fixtures/boundary.fixture";
import { validateInput } from "@/app/tools/offer-liability-inspector/schema";
const input = { accountId, network: "testnet" as const };
describe("inspector", () => {
  it("compares offers and account on the requested network", async () => { const result = await runInspector(input, { loadAccount: async () => normalAccount, loadPage: async () => ({ records: normalOffers }) }); expect(result.network).toBe("testnet"); expect(result.incomplete).toBe(false); expect(result.groups.every(g => g.status === "covered")).toBe(true); });
  it("distinguishes an empty valid snapshot", async () => { const result = await runInspector(input, { loadAccount: async () => emptyAccount, loadPage: async () => ({ records: [] }) }); expect(result.offers).toHaveLength(0); expect(result.incomplete).toBe(false); });
  it("marks missing evidence incomplete", async () => { const result = await runInspector(input, { loadAccount: async () => missingLiabilityAccount, loadPage: async () => ({ records: [] }) }); expect(result.incomplete).toBe(true); });
  it("detects edited offer mismatch", async () => { const result = await runInspector(input, { loadAccount: async () => normalAccount, loadPage: async () => ({ records: [editedOffer] }) }); expect(result.groups.some(g => g.status === "mismatch")).toBe(true); });
  it("maps provider failures without successful output", async () => { await expect(runInspector(input, { loadAccount: async () => { throw { status: 429 }; }, loadPage: async () => ({ records: [] }) })).rejects.toEqual({ status: 429 }); expect(errorCode({ status: 429 })).toBe("rate_limited"); expect(errorCode({ status: 404 })).toBe("not_found"); });
  it("uses one selected network for account and offers requests", async () => {
    const request = vi.fn(async (url: URL) => ({ ok: true, json: async () => url.pathname.endsWith("/offers") ? { _embedded: { records: [] } } : emptyAccount }));
    vi.stubGlobal("fetch", request);
    try { await runInspector(input); expect(request).toHaveBeenCalledTimes(2); for (const [url] of request.mock.calls) expect(String(url)).toContain("horizon-testnet.stellar.org/accounts/"); expect(String(request.mock.calls[1][0])).toContain("limit=20"); }
    finally { vi.unstubAllGlobals(); }
  });
  it("rejects a secret seed without any request", () => { const request = vi.fn(); vi.stubGlobal("fetch", request); try { expect(() => validateInput("S".repeat(56), "testnet")).toThrow(); expect(request).not.toHaveBeenCalled(); } finally { vi.unstubAllGlobals(); } });
});
