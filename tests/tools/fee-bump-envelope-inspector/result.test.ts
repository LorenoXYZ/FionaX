import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { FeeBumpEnvelopeInspectorResult } from "@/app/tools/fee-bump-envelope-inspector/components/FeeBumpEnvelopeInspectorResult";
import { inspectFeeBump } from "@/app/tools/fee-bump-envelope-inspector/lib/feeBumpEnvelopeInspector";
import { makeEnvelope, passphrase } from "./fixtures/normal.fixture";
describe("result evidence", () => {
  it("labels each payload and explains missing signatures", () => {
    const { envelope } = makeEnvelope({ outerSigned: false });
    const markup = renderToStaticMarkup(createElement(FeeBumpEnvelopeInspectorResult, { result: inspectFeeBump({ envelope, passphrase }) }));
    expect(markup).toContain("Incomplete signature evidence");
    expect(markup).toContain("Authorize the inner transaction payload");
    expect(markup).toContain("Authorize the fee-bump payload");
    expect(markup).toContain("No signatures in this layer");
  });
});
