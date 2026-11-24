# Soroban Resource Budget Explainer

Reads a pasted `simulateTransaction` result. It does not simulate anything.

A `restorePreamble` is a restore outcome. An `error` string without that preamble is a failure. Instruction, read-byte, and write-byte values come from `SorobanTransactionData` and keep their units. `minResourceFee`, the XDR `resourceFee`, and an optional envelope fee stay separate integer strings. A missing metric stays undeclared.
