# Fee-Bump Envelope Inspector

Paste one canonical base64 XDR transaction envelope and an explicit network passphrase. Decoding and hashing happen in browser memory; no network or wallet calls occur. Reset clears both input fields and the result. The tool accepts fee-bump envelopes wrapping a V1 transaction. Ordinary transaction envelopes and unknown inner variants are rejected.

The decoded XDR supplies the outer fee payer, exact fee in stroops, inner source, sequence, operation types and sources, and both decorated-signature sets. The installed Stellar SDK computes the network-specific outer and inner hashes. Muxed addresses remain M addresses. The tool does not verify signatures, check ledger state, or establish submission readiness. Missing signatures are reported as incomplete evidence.

Input is bounded at 64 KiB of decoded XDR and 256 network passphrase characters. Noncanonical base64, malformed XDR, and unsupported variants have distinct outcomes. Nothing is persisted.
