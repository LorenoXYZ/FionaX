import { describe, expect, it } from "vitest";
import { summarizeFeeAndOperations } from "@/app/tools/fee-bump-envelope-inspector/lib/fee-summary";
import { decodeFeeBump } from "@/app/tools/fee-bump-envelope-inspector/lib/fee-bump-decode";
import { makeEnvelope, passphrase } from "./fixtures/normal.fixture";
describe("summarizeFeeAndOperations", () => {
  it("reports the raw fee and operation identity", () => {
    const { raw, transaction } = decodeFeeBump(makeEnvelope().envelope, passphrase);
    expect(summarizeFeeAndOperations(raw, transaction.innerTransaction.source)).toEqual({ feeStroops: transaction.fee, operations: [{ index: 1, type: "manageData", source: transaction.innerTransaction.source }] });
  });
});
