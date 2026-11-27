import { describe, expect, it } from "vitest";
import { decodeFeeBump } from "@/app/tools/fee-bump-envelope-inspector/lib/fee-bump-decode";
import { makeEnvelope, passphrase } from "./fixtures/normal.fixture";
import { ordinaryEnvelope } from "./fixtures/malformed.fixture";
describe("decodeFeeBump", () => {
  it("decodes both layers", () => expect(decodeFeeBump(makeEnvelope().envelope, passphrase).transaction.innerTransaction).toBeDefined());
  it("rejects ordinary transaction envelopes", () => expect(() => decodeFeeBump(ordinaryEnvelope(), passphrase)).toThrowError(/supported fee-bump/));
  it("rejects truncated XDR", () => expect(() => decodeFeeBump(makeEnvelope().envelope.slice(0, 20), passphrase)).toThrow());
});
