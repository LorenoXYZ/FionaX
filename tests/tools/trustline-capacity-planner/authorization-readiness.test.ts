import { describe, expect, it } from "vitest";
import { resolveAuthorization } from "@/app/tools/trustline-capacity-planner/lib/authorization-readiness";
import type { TrustlineRecord } from "@/app/tools/trustline-capacity-planner/types";

function record(partial: Partial<TrustlineRecord>): TrustlineRecord {
  return {
    assetType: "credit_alphanum4",
    assetCode: "USDC",
    assetIssuer: "GABCDEF",
    balance: "1.0000000",
    limit: "10.0000000",
    isAuthorized: false,
    isAuthorizedToMaintainLiabilities: false,
    ...partial
  };
}

describe("resolveAuthorization", () => {
  it("returns authorized when is_authorized is true", () => {
    expect(resolveAuthorization(record({ isAuthorized: true }))).toBe("authorized");
  });

  it("returns authorized_to_maintain_liabilities when only that flag is set", () => {
    expect(resolveAuthorization(record({ isAuthorizedToMaintainLiabilities: true }))).toBe(
      "authorized_to_maintain_liabilities"
    );
  });

  it("prefers authorized over maintain-liabilities when both are set", () => {
    expect(
      resolveAuthorization(record({ isAuthorized: true, isAuthorizedToMaintainLiabilities: true }))
    ).toBe("authorized");
  });

  it("returns unauthorized when neither flag is set", () => {
    expect(resolveAuthorization(record({}))).toBe("unauthorized");
  });
});
