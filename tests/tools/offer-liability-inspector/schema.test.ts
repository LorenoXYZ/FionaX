import { describe, expect, it } from "vitest";
import { validateInput } from "@/app/tools/offer-liability-inspector/schema";
import { accountId } from "./fixtures/normal.fixture";
describe("public account input", () => {
  it("trims a checked public key and keeps network", () => expect(validateInput(` ${accountId} `, "mainnet")).toEqual({ accountId, network: "mainnet" }));
  it.each(["", "S".repeat(56), "G".repeat(56)])("rejects malformed or private input before requests", raw => expect(() => validateInput(raw, "testnet")).toThrow());
  it("rejects oversized input", () => expect(() => validateInput("X".repeat(129), "testnet")).toThrow());
  it("rejects unsupported network", () => expect(() => validateInput(accountId, "other" as "testnet")).toThrow());
});
