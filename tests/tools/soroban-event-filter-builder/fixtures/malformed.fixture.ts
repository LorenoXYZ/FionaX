export const notJson = "{";

export const badContract = {
  filters: [{ contractIds: ["not-a-contract"], topics: [[{ type: "symbol", value: "transfer" }]] }]
};

export const invertedRange = {
  startLedger: "20",
  endLedger: "20",
  filters: [{ topics: [[{ type: "symbol", value: "transfer" }]] }]
};

export const multiNotLast = {
  filters: [{
    topics: [[
      { type: "wildcard", value: "**" },
      { type: "symbol", value: "transfer" }
    ]]
  }]
};
