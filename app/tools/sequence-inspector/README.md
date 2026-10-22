# Account Sequence Number Inspector

Shows an account's current sequence number and the next valid sequence
number for a new transaction, and explains what an unconfirmed pending
transaction means for that value.

## How it works

**Data source:** Horizon `GET /accounts/{account_id}`.

1. `schema.ts` validates the account ID, rejecting anything that looks like
   a secret key on sight, before any request.
2. `lib/sequence-fetch.ts` loads the account and reads its `sequence`
   field — already typed as a `string` by the Stellar SDK, since it is a
   64-bit integer.
3. `lib/next-sequence.ts` computes `currentSequence + 1`, the only value
   the Stellar protocol accepts as the sequence number on this account's
   next transaction.
4. `lib/sequenceInspector.ts` composes those two into the result; a
   `PendingTransactionWarning` is always shown alongside it (see below).

## Non-obvious decisions

- **`BigInt` end to end, never `Number`.** A sequence number is a 64-bit
  integer and routinely exceeds `Number.MAX_SAFE_INTEGER` (2^53 - 1) —
  converting through `Number` would silently round a real, valid sequence
  number to the wrong value. `lib/next-sequence.ts` and
  `lib/bigint-format.ts` only ever parse the Horizon string with `BigInt`
  and serialize back to a string; nothing in this tool ever calls `Number()`
  on a sequence number. This project's `tsconfig.json` targets `es5`, so
  `BigInt` literals (`1n`) aren't available — every value is built with the
  `BigInt(...)` constructor instead, matching the convention already used
  in `reserve-calculator`.
- **The pending-transaction warning is unconditional, not derived.**
  Horizon's account resource has no field indicating "a transaction is
  currently in flight with this sequence number" — there is no way for this
  tool to know. Rather than imply false certainty by only warning when it
  "detects" a pending transaction (which it never actually could),
  `PendingTransactionWarning` explains the risk every time a lookup
  succeeds. This matches the acceptance criterion directly: explain the
  risk, don't pretend to detect it.
- **`lib/bigint-format.ts` vs. `lib/format.ts`.** `bigint-format.ts` is a
  generic, precision-safe decimal formatter with no knowledge of this tool.
  `format.ts` is the one module every component actually imports from —
  it re-exports a sequence-number-specific wrapper so a future change to
  how sequence numbers are displayed only touches one call site.
- **This project has no HTTP-mocking library installed.** Both
  `lib/sequence-fetch.ts` (around the raw Horizon `loadAccount` call) and
  `lib/sequenceInspector.ts` (around `lib/sequence-fetch.ts` itself) take
  their dependency as an injectable parameter, so tests pass
  fixture-returning functions directly instead of mocking a network layer.

## Safety

This tool never accepts, displays, stores or transmits a secret key. The
account ID field rejects any value starting with `S` on sight, before any
request is built. No transaction is ever built or submitted — this tool
only reads.

## Out of scope

No transaction building or submission, and no `bump_sequence` operation
creation — this tool only reads and explains the account's current and
next sequence number.
