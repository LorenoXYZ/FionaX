import { describe, expect, it } from "vitest";
import { runTrustlineCapacityPlanner } from "@/app/tools/trustline-capacity-planner/lib/trustlineCapacityPlanner";
import {
  normalInput,
  expectedCapacity
} from "@/tests/tools/trustline-capacity-planner/fixtures/normal.fixture";
import {
  boundaryIssuerId,
  zeroHeadroomRecord,
  negativeHeadroomRecord,
  largeAmountRecord,
  largeExpectedCapacity
} from "@/tests/tools/trustline-capacity-planner/fixtures/boundary.fixture";
import {
  nativeRecord,
  notJson,
  arrayRecord,
  missingLimitRecord,
  malformedAmountRecord
} from "@/tests/tools/trustline-capacity-planner/fixtures/malformed.fixture";
import {
  incompleteIssuerId,
  missingLiabilitiesRecord
} from "@/tests/tools/trustline-capacity-planner/fixtures/incomplete.fixture";

describe("runTrustlineCapacityPlanner", () => {
  it("computes limit minus balance minus buying liabilities for a normal trustline", () => {
    const outcome = runTrustlineCapacityPlanner(normalInput);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.receivingCapacity).toBe(expectedCapacity);
    expect(outcome.result.authorization).toBe("authorized");
    expect(outcome.result.liabilitiesIncomplete).toBe(false);
  });

  it("reports zero headroom when limit equals balance", () => {
    const outcome = runTrustlineCapacityPlanner({
      accountId: normalInput.accountId,
      assetCode: "USDC",
      issuerId: boundaryIssuerId,
      rawRecord: JSON.stringify(zeroHeadroomRecord)
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.receivingCapacity).toBe("0.0000000");
  });

  it("reports a negative headroom when liabilities push past the limit", () => {
    const outcome = runTrustlineCapacityPlanner({
      accountId: normalInput.accountId,
      assetCode: "USDC",
      issuerId: boundaryIssuerId,
      rawRecord: JSON.stringify(negativeHeadroomRecord)
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.receivingCapacity).toBe("-15.0000000");
  });

  it("preserves 64-bit-scale amounts without precision loss", () => {
    const outcome = runTrustlineCapacityPlanner({
      accountId: normalInput.accountId,
      assetCode: "HUGEASSET",
      issuerId: boundaryIssuerId,
      rawRecord: JSON.stringify(largeAmountRecord)
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.receivingCapacity).toBe(largeExpectedCapacity);
  });

  it("rejects a native asset record as an unsupported variant", () => {
    const outcome = runTrustlineCapacityPlanner({
      accountId: normalInput.accountId,
      assetCode: "XLM",
      issuerId: boundaryIssuerId,
      rawRecord: JSON.stringify(nativeRecord)
    });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe("unsupported_variant");
  });

  it("rejects non-JSON as malformed data", () => {
    const outcome = runTrustlineCapacityPlanner({
      accountId: normalInput.accountId,
      assetCode: "USDC",
      issuerId: boundaryIssuerId,
      rawRecord: notJson
    });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe("malformed_data");
  });

  it("rejects an array as malformed data", () => {
    const outcome = runTrustlineCapacityPlanner({
      accountId: normalInput.accountId,
      assetCode: "USDC",
      issuerId: boundaryIssuerId,
      rawRecord: arrayRecord
    });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe("malformed_data");
  });

  it("rejects a record missing its limit as malformed data", () => {
    const outcome = runTrustlineCapacityPlanner({
      accountId: normalInput.accountId,
      assetCode: "USDC",
      issuerId: boundaryIssuerId,
      rawRecord: JSON.stringify(missingLimitRecord)
    });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe("malformed_data");
  });

  it("rejects a non-numeric amount as malformed data", () => {
    const outcome = runTrustlineCapacityPlanner({
      accountId: normalInput.accountId,
      assetCode: "USDC",
      issuerId: boundaryIssuerId,
      rawRecord: JSON.stringify(malformedAmountRecord)
    });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe("malformed_data");
  });

  it("flags missing liabilities as incomplete rather than assuming zero", () => {
    const outcome = runTrustlineCapacityPlanner({
      accountId: normalInput.accountId,
      assetCode: "USDC",
      issuerId: incompleteIssuerId,
      rawRecord: JSON.stringify(missingLiabilitiesRecord)
    });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.liabilitiesIncomplete).toBe(true);
    expect(outcome.result.buyingLiabilities).toBe("0.0000000");
  });

  it("rejects a record whose asset code disagrees with the selection", () => {
    const outcome = runTrustlineCapacityPlanner({
      accountId: normalInput.accountId,
      assetCode: "EURT",
      issuerId: incompleteIssuerId,
      rawRecord: JSON.stringify(missingLiabilitiesRecord)
    });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe("malformed_data");
  });
});
