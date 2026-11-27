# Claimable Balance Expiry Calendar

Read-only Horizon lookup for one public G claimant on the selected testnet or mainnet. The tool fetches ascending claimable balance pages of 20 records, at most five pages / 100 records. Records are deduplicated by balance ID; each matching claimant entry retains its own predicate and claimant index. A full final page means evidence is incomplete, with a paging token shown for reference.

Supports Horizon `unconditional`, `absBefore`, `absBeforeEpoch`, `relBefore`, `and`, `or`, and `not` predicates. Only a standalone absolute-before condition becomes a known deadline. Relative conditions need the balance creation instant, which this Horizon balance response does not establish; compound conditions can have more complex truth windows. They appear separately without an inferred deadline. Absolute deadlines are exclusive: at the deadline the condition is expired. Display is UTC, and balances and amounts stay as exact strings.

Horizon supplies the balance record and selected network supplies the endpoint. The tool does not sign transactions, use a wallet, persist data, or make offline assertions. Invalid input is rejected before requests. Unknown variants and malformed records fail closed. A zero-record response is a valid empty result only when an end page is observed. No transaction history is queried to establish creation times.
