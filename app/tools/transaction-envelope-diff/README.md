# Transaction Envelope Semantic Diff

Compare two Stellar transaction envelopes semantically and show what changed —
sources, preconditions, memo, operations, and signatures — without submitting
anything.

## What it does

The tool reads two base64 XDR envelopes and:

1. Decodes each into its structured XDR form (v0, v1, or fee bump).
2. Normalizes every nested value to a canonical representation, so two
   envelopes that mean the same thing compare equal even when their base64
   encodings differ.
3. Reports field-level, operation-level, and signature-level differences
   separately, and flags a fee-bump-only change.

## Data boundaries

- **Fully offline.** No network requests, wallet connection, or submission.
  Pasted envelopes stay in memory and are discarded on reset.
- **No secrets.** This tool decodes public transaction envelopes only; it never
  signs or submits.
- **Canonical comparison.** Amounts, assets, muxed accounts, memos,
  preconditions and operations are reduced to their canonical XDR bytes, so
  encoding-only differences never surface as semantic changes.

## Known limits

- Signatures are compared as an order-insensitive set, so a re-signature is
  reported as a signature change, never a payload change.
- Only classic transaction envelopes (v0, v1, fee bump) are supported.
  Soroban invocation envelopes reuse the same envelope XDR and are handled by
  the operation-level diff.
- Each envelope is capped at 1,000,000 characters.

## Supported protocol variants

Classic Stellar transaction envelopes (`TransactionEnvelope`), including v0,
v1, and fee-bump wrappers, as produced by the Stellar SDK's `toEnvelope()`.
