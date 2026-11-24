import { contractA } from "@/tests/tools/soroban-event-filter-builder/fixtures/normal.fixture";

export const wildcardOnly = {
  filters: [
    {
      contractIds: [contractA],
      topics: [[{ type: "wildcard", value: "*" }, { type: "wildcard", value: "**" }]]
    }
  ]
};

export const exactRange = {
  startLedger: "50",
  endLedger: "51",
  limit: "1",
  filters: [{ contractIds: [contractA], topics: [[{ type: "symbol", value: "mint" }]] }]
};

export const maxSegments = {
  filters: [
    {
      contractIds: [contractA],
      topics: [[
        { type: "symbol", value: "a" },
        { type: "symbol", value: "b" },
        { type: "symbol", value: "c" },
        { type: "symbol", value: "d" },
        { type: "wildcard", value: "**" }
      ]]
    }
  ]
};
