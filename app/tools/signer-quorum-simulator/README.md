# Signer Quorum Simulator

Simulate whether a local subset of an account's signers reaches its low, medium
and high thresholds — without collecting a single signature.

## What it does

The tool reads a pasted public Horizon account JSON record and a local selection
of signer identifiers, then:

1. Normalizes the account's signers and thresholds (including the master key).
2. Deduplicates the selection so each signer is counted exactly once.
3. Sums the selected weights and evaluates every threshold.
4. Reports a shortfall for each threshold and flags signers that were selected
   but do not exist on the account.

## Data boundaries

- **Fully offline.** No network requests, wallet connection, or callback
  fetching. Pasted JSON stays in memory and is discarded on reset.
- **No secrets.** Secret seeds (`S…`) are rejected before any decode attempt.
- **Lossless keys.** Signer keys and account IDs are carried as raw strings;
  only display is truncated. Weights and thresholds are integers `0..255`.

## Known limits

- Only classic Stellar signer types are supported: `ed25519_public_key`,
  `preauth_tx` (`T…`) and `sha256_hash` (`X…`). Unsupported key formats surface
  as an `unsupported_variant` error.
- Missing weights or thresholds are treated as unknown, never as zero, so an
  incomplete record cannot produce an optimistic success.
- The pasted JSON is capped at 200,000 characters and the selection at 64 keys.

## Supported protocol variants

Stellar accounts using the classic signer/threshold model, as returned by
Horizon's `/accounts/{id}` endpoint.
