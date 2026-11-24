# Trustline Receiving Capacity Planner

Calculates how much more an issued-asset trustline can receive, from a pasted
Horizon balance record and the explicit asset code / issuer identity.

## Behavior

- Parses a single Horizon `balance` entry for a `credit_alphanum4` or
  `credit_alphanum12` asset.
- Computes exact headroom as `limit − balance − buying liabilities` in signed
  64-bit stroops, rendered back to seven decimal places. No value is ever
  routed through a JavaScript `number`.
- Reports the authorization state (`authorized`, `authorized_to_maintain_liabilities`,
  or `unauthorized`) separately from the numeric headroom, because a trustline
  that is not fully authorized has zero real receiving capacity.
- Flags a record that omits liabilities as *incomplete evidence* rather than
  silently treating liabilities as zero.

## Data boundaries

- Fully offline: nothing is fetched, signed, or submitted. Pasted input lives in
  memory and is discarded on reset.
- Rejects secret seeds before any work. Renders pasted text as inert content.
- Binds the record to the selected account, asset code, and issuer; a mismatch
  is reported as malformed evidence rather than accepted.

## Supported variants

- `credit_alphanum4` and `credit_alphanum12` trustlines.
- Native (XLM) and liquidity-pool-share entries are rejected as unsupported:
  they carry no limit or issuer, so a receiving capacity is undefined.

## Known limits

- Liabilities are taken from the pasted record only. When absent, the result
  marks itself as incomplete rather than guessing.
- The record is capped at 20,000 characters to keep parsing bounded.
