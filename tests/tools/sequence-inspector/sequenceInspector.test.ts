import { describe, expect, it } from "vitest";
import { runSequenceInspector } from "@/app/tools/sequence-inspector/lib/sequenceInspector";
import { toToolError } from "@/app/tools/sequence-inspector/lib/sequenceInspector.errors";
import { accountId, accountSequenceDeps, currentSequence, expectedNextSequence } from "@/tests/tools/sequence-inspector/fixtures/account-sequence.fixture";
import { highCurrentSequence, highSequenceDeps, expectedHighNextSequence } from "@/tests/tools/sequence-inspector/fixtures/high-sequence.fixture";
import { missingAccountDeps } from "@/tests/tools/sequence-inspector/fixtures/missing-account.fixture";

describe("runSequenceInspector", () => {
  it("returns the current and next sequence number for a plain account", async () => {
    const result = await runSequenceInspector({ accountId }, accountSequenceDeps);
    expect(result.accountId).toBe(accountId);
    expect(result.currentSequence).toBe(currentSequence);
    expect(result.nextSequence).toBe(expectedNextSequence);
  });

  it("computes the next sequence number exactly for a 64-bit value beyond Number.MAX_SAFE_INTEGER", async () => {
    const result = await runSequenceInspector({ accountId }, highSequenceDeps);
    expect(result.currentSequence).toBe(highCurrentSequence);
    expect(result.nextSequence).toBe(expectedHighNextSequence);
  });

  it("propagates a loader failure for the caller to map into a tool error", async () => {
    await expect(runSequenceInspector({ accountId }, missingAccountDeps)).rejects.toThrow();
  });
});

describe("toToolError", () => {
  it("maps a 404 response to account_not_found", async () => {
    try {
      await missingAccountDeps.loadSequence(accountId);
      throw new Error("expected missingAccountDeps.loadSequence to throw");
    } catch (error) {
      expect(toToolError(error)).toEqual({
        code: "account_not_found",
        message: "No account exists for that ID on the selected network."
      });
    }
  });

  it("maps a 429 response to rate_limited", () => {
    const error = Object.assign(new Error("Too Many Requests"), { response: { status: 429 } });
    expect(toToolError(error)).toEqual({
      code: "rate_limited",
      message: "Horizon is throttling requests. Wait a moment and try again."
    });
  });

  it("maps any other failure to request_failed", () => {
    expect(toToolError(new Error("ECONNRESET"))).toEqual({
      code: "request_failed",
      message: "The account lookup did not complete. Check the selected network and try again."
    });
    expect(toToolError("not even an Error instance")).toEqual({
      code: "request_failed",
      message: "The account lookup did not complete. Check the selected network and try again."
    });
  });
});
