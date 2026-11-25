import { accountId, native } from "./normal.fixture";
export const missingLiabilityAccount = { id: accountId, balances: [{ ...native, balance: "10.0000000" }] };
export const emptyAccount = { id: accountId, balances: [{ ...native, balance: "2.0000000", selling_liabilities: "0", buying_liabilities: "0" }] };
