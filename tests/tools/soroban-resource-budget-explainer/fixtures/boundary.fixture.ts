import { transactionDataXdr } from "@/tests/tools/soroban-resource-budget-explainer/fixtures/normal.fixture";

export const LARGE_MIN_FEE = "9007199254740993";

export function largeFeeSimulation() {
  return JSON.stringify({
    jsonrpc: "2.0",
    result: { transactionData: transactionDataXdr(), minResourceFee: LARGE_MIN_FEE, results: [] }
  });
}
