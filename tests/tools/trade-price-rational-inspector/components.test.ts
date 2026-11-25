import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { TradePriceRationalInspectorPanel } from "@/app/tools/trade-price-rational-inspector/components/TradePriceRationalInspectorPanel";
import { TradePriceRationalInspectorResult } from "@/app/tools/trade-price-rational-inspector/components/TradePriceRationalInspectorResult";
import { TradePriceRationalInspectorForm } from "@/app/tools/trade-price-rational-inspector/components/TradePriceRationalInspectorForm";
import { runTradePriceRationalInspector } from "@/app/tools/trade-price-rational-inspector/lib/tradePriceRationalInspector";
import { normalTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/normal.fixture";
import { noPriceTrade } from "@/tests/tools/trade-price-rational-inspector/fixtures/incomplete.fixture";
describe("accessible states", () => {
  it("renders labeled initial input and local-only guidance", () => {
    const html = renderToStaticMarkup(createElement(TradePriceRationalInspectorPanel));
    expect(html).toContain('for="trade-json"');
    expect(html).toContain('id="trade-json"');
    expect(html).toContain("Local processing only");
    expect(html).toContain("Paste a JSON array");
  });
  it("renders success and evidence gaps without asserting missing price", () => {
    const result = runTradePriceRationalInspector({ source: "array", records: [normalTrade, noPriceTrade] });
    const html = renderToStaticMarkup(createElement(TradePriceRationalInspectorResult, { result }));
    expect(html).toContain("1 compared, 1 incomplete");
    expect(html).toContain("Evidence gaps");
    expect(html).toContain("No rational price");
    expect(html).toContain("Cross difference");
  });
  it("renders local-processing and validation feedback accessibly", () => {
    const loading = renderToStaticMarkup(createElement(TradePriceRationalInspectorForm, { onSubmit: () => {}, onReset: () => {}, loading: true }));
    expect(loading).toContain("Comparing…");
    const error = renderToStaticMarkup(createElement(TradePriceRationalInspectorForm, { onSubmit: () => {}, onReset: () => {}, loading: false, error: "Paste valid JSON." }));
    expect(error).toContain('aria-invalid="true"');
    expect(error).toContain("Paste valid JSON.");
  });
});
