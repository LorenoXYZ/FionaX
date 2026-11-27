import { Keypair } from "@stellar/stellar-sdk";
export const accountId = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 1)).publicKey();
export const issuerA = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 2)).publicKey();
export const issuerB = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 3)).publicKey();
export const native = { asset_type: "native" };
export const usdA = { asset_type: "credit_alphanum4", asset_code: "USD", asset_issuer: issuerA };
export const usdB = { asset_type: "credit_alphanum4", asset_code: "USD", asset_issuer: issuerB };
export const normalOffers = [
  { id: "9223372036854775807", paging_token: "1", seller: accountId, selling: native, buying: usdA, amount: "2.0000000", price_r: { n: 3, d: 2 } },
  { id: "2", paging_token: "2", seller: accountId, selling: usdB, buying: native, amount: "1.0000000", price_r: { n: 1, d: 3 } }
];
export const normalAccount = { id: accountId, balances: [
  { ...native, balance: "10.0000000", selling_liabilities: "2.0000000", buying_liabilities: "0.3333334" },
  { ...usdA, balance: "5.0000000", selling_liabilities: "0", buying_liabilities: "3.0000000" },
  { ...usdB, balance: "5.0000000", selling_liabilities: "1.0000000", buying_liabilities: "0" }
] };
