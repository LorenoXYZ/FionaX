import { StrKey } from "@stellar/stellar-sdk";

export const contractA = StrKey.encodeContract(Buffer.alloc(32, 1));
export const contractB = StrKey.encodeContract(Buffer.alloc(32, 2));

export const normalFilter = {
  startLedger: "1000",
  endLedger: "1100",
  limit: "10",
  filters: [
    {
      type: "contract",
      contractIds: [contractA, contractB],
      topics: [
        [
          { type: "symbol", value: "transfer" },
          { type: "string", value: "memo" }
        ]
      ]
    }
  ]
};

export function normalJson() {
  return JSON.stringify(normalFilter);
}
