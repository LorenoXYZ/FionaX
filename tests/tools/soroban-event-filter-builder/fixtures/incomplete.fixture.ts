import { contractA } from "@/tests/tools/soroban-event-filter-builder/fixtures/normal.fixture";

export const missingLedger = {
  filters: [{ contractIds: [contractA], topics: [[{ type: "string", value: "hello" }]] }]
};
