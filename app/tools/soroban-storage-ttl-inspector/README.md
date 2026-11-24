# Soroban Storage TTL Inspector

Builds a contract-data ledger key from a contract ID, temporary or persistent durability, and a typed key. It asks Soroban RPC `getLedgerEntries` for at most 20 keys.

Remaining ledgers are `liveUntilLedgerSeq - latestLedger`, and only when both values were returned and the entry is still live. A missing key stays absent. An entry without `liveUntilLedgerSeq` stays unknown. The exact live-until ledger is expired. This is not an archival or restore transaction.
