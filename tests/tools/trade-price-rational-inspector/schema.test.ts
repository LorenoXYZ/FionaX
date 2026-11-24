import { describe, expect, it } from "vitest";
import { validateTradePriceRationalInspectorInput as validate, MAX_CHARACTERS } from "@/app/tools/trade-price-rational-inspector/schema";
import { normalTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/normal.fixture";
describe("input envelope", () => {
  it("accepts an array and Horizon page", () => {
    expect(validate(JSON.stringify([normalTrade]))).toMatchObject({ ok: true, input: { source: "array" } });
    expect(validate(JSON.stringify({ _embedded: { records: [normalTrade] } }))).toMatchObject({ ok: true, input: { source: "horizon_page" } });
  });
  it("distinguishes empty, malformed and unsupported input", () => {
    expect(validate(" ")).toMatchObject({ ok: false, error: { code: "invalid_input" } });
    expect(validate("[]")).toMatchObject({ ok: false, error: { code: "invalid_input" } });
    expect(validate("[bad")).toMatchObject({ ok: false, error: { code: "malformed_data" } });
    expect(validate("{}")).toMatchObject({ ok: false, error: { code: "unsupported_variant" } });
  });
  it("rejects oversized input and seed-shaped text before decoding", () => {
    expect(validate(JSON.stringify(Array(101).fill(normalTrade)))).toMatchObject({ ok: false, error: { code: "too_large" } });
    expect(validate("x".repeat(MAX_CHARACTERS + 1))).toMatchObject({ ok: false, error: { code: "too_large" } });
    expect(validate('"S' + "A".repeat(55) + '"')).toMatchObject({ ok: false, error: { code: "invalid_input" } });
  });
});
