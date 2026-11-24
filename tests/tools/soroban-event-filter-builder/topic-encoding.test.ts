import { nativeToScVal } from "@stellar/stellar-sdk";
import { describe, expect, it } from "vitest";
import { encodeTopic, encodeTopicSegment } from "@/app/tools/soroban-event-filter-builder/lib/topic-encoding";

describe("topic encoding", () => {
  it("encodes a symbol and a string with the SDK, not as raw text", () => {
    const symbol = encodeTopicSegment({ type: "symbol", value: "transfer" }, 0);
    const text = encodeTopicSegment({ type: "string", value: "transfer" }, 0);
    expect(symbol.ok && symbol.segment.text).toBe(nativeToScVal("transfer", { type: "symbol" }).toXDR("base64"));
    expect(text.ok && text.segment.text).toBe(nativeToScVal("transfer", { type: "string" }).toXDR("base64"));
    expect(symbol.ok && text.ok && symbol.segment.text).not.toBe(text.segment.text);
  });

  it("keeps a wildcard as * and rejects ** anywhere but the end", () => {
    const star = encodeTopic([{ type: "wildcard", value: "*" }]);
    expect(star.ok && star.segments[0]?.text).toBe("*");
    const bad = encodeTopic([
      { type: "wildcard", value: "**" },
      { type: "symbol", value: "transfer" }
    ]);
    expect(bad.ok).toBe(false);
  });

  it("rejects a fifth counted segment", () => {
    const result = encodeTopic([
      { type: "symbol", value: "a" },
      { type: "symbol", value: "b" },
      { type: "symbol", value: "c" },
      { type: "symbol", value: "d" },
      { type: "symbol", value: "e" }
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("too_large");
  });
});
