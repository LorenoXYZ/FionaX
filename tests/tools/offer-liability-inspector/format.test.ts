import { describe, expect, it } from "vitest";
import { amountToStroops, assetFromWire, formatAmount, parseRatio } from "@/app/tools/offer-liability-inspector/lib/format";
import { usdA, usdB } from "./fixtures/normal.fixture";
describe("exact wire formatting", () => {
  it("keeps seven decimals and 64-bit maximum", () => expect(formatAmount(amountToStroops("922337203685.4775807"))).toBe("922337203685.4775807"));
  it("does not merge issuers sharing a code", () => expect(assetFromWire(usdA).key).not.toBe(assetFromWire(usdB).key));
  it("rejects excessive precision and unsafe ratio", () => { expect(() => amountToStroops("0.00000001")).toThrow(); expect(() => parseRatio({ n: 1.5, d: 1 })).toThrow(); });
});
