# Wasm Custom Section Inspector

Reads one local Wasm file, up to 1 MiB, and does not instantiate it.

Custom sections stay in the order they appear, including duplicates. `contractenvmetav0`, `contractspecv0`, and `contractmetav0` are decoded on their own, so a missing publisher section is not reported as a missing environment section. Unknown section bodies are shown by size only. A section length must fit in an unsigned 32-bit integer.
