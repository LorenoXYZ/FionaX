# Soroban Event Filter Builder

Builds a `getEvents` JSON-RPC preview from contract IDs, typed topic segments, and ledger bounds. It does not call RPC.

## Bounds

These match the current `getEvents` contract: at most 5 filters, 5 contract IDs in the request, 1–4 topic segments (`**` may trail and does not count), and a page limit from 1 to 10000. `endLedger` is exclusive. A missing start ledger or limit is left out of the preview.

## Topics

`symbol`, `string`, `u32`, `u64`, `i64`, `bool`, `address`, and `bytes` are encoded with the installed SDK. `*` and `**` stay literal. A secret seed is rejected and is not stored.
