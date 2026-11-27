import { describe, expect, it } from "vitest";
import { networkHashes } from "@/app/tools/fee-bump-envelope-inspector/lib/network-hashes";
import { decodeFeeBump } from "@/app/tools/fee-bump-envelope-inspector/lib/fee-bump-decode";
import { makeEnvelope, passphrase } from "./fixtures/normal.fixture";
describe("networkHashes", () => {
  it("hashes each payload separately", () => {
    const { envelope } = makeEnvelope();
    const first = networkHashes(decodeFeeBump(envelope, passphrase).transaction);
    const second = networkHashes(decodeFeeBump(envelope, "another network").transaction);
    expect(first.outerHash).toHaveLength(64);
    expect(first.innerHash).toHaveLength(64);
    expect(first.outerHash).not.toBe(first.innerHash);
    expect(second.innerHash).not.toBe(first.innerHash);
  });
});
