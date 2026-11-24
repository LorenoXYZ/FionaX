import { describe, expect, it } from "vitest";
import { parseTrustlineRecord } from "@/app/tools/trustline-capacity-planner/lib/trustline-record";
import { normalRecord } from "@/tests/tools/trustline-capacity-planner/fixtures/normal.fixture";
import {
  nativeRecord,
  notJson,
  arrayRecord,
  missingLimitRecord,
  malformedAmountRecord
} from "@/tests/tools/trustline-capacity-planner/fixtures/malformed.fixture";
import { missingLiabilitiesRecord } from "@/tests/tools/trustline-capacity-planner/fixtures/incomplete.fixture";

describe("parseTrustlineRecord", () => {
  it("parses a normal credit_alphanum4 record", () => {
    const result = parseTrustlineRecord(JSON.stringify(normalRecord));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.record.balance).toBe("12.0000000");
    expect(result.record.limit).toBe("100.0000000");
    expect(result.record.buyingLiabilities).toBe("3.5000000");
    expect(result.record.isAuthorized).toBe(true);
    expect(result.liabilitiesMissing).toBe(false);
  });

  it("parses a credit_alphanum12 record", () => {
    const record = { ...normalRecord, asset_type: "credit_alphanum12", asset_code: "HUGEASSET" };
    const result = parseTrustlineRecord(JSON.stringify(record));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.record.assetType).toBe("credit_alphanum12");
  });

  it("rejects a native asset as an unsupported variant", () => {
    const result = parseTrustlineRecord(JSON.stringify(nativeRecord));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("unsupported_variant");
  });

  it("rejects non-JSON as malformed data", () => {
    const result = parseTrustlineRecord(notJson);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("malformed_data");
  });

  it("rejects an array as malformed data", () => {
    const result = parseTrustlineRecord(arrayRecord);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("malformed_data");
  });

  it("rejects a record missing its limit", () => {
    const result = parseTrustlineRecord(JSON.stringify(missingLimitRecord));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("malformed_data");
  });

  it("rejects a non-numeric amount", () => {
    const result = parseTrustlineRecord(JSON.stringify(malformedAmountRecord));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("malformed_data");
  });

  it("flags missing liabilities as incomplete", () => {
    const result = parseTrustlineRecord(JSON.stringify(missingLiabilitiesRecord));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.liabilitiesMissing).toBe(true);
    expect(result.record.buyingLiabilities).toBeUndefined();
  });
});
