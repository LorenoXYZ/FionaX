import { Account, Keypair, Networks, Operation, TransactionBuilder, xdr, Address, nativeToScVal, StrKey } from "@stellar/stellar-sdk";

export const LARGE_FEE = "9007199254740993";
export const contractId = StrKey.encodeContract(Buffer.alloc(32, 9));

export function transactionDataXdr() {
  const key = xdr.LedgerKey.contractData(new xdr.LedgerKeyContractData({
    contract: new Address(contractId).toScAddress(),
    key: nativeToScVal("Balance", { type: "symbol" }),
    durability: xdr.ContractDataDurability.persistent()
  }));
  return new xdr.SorobanTransactionData({
    ext: new (xdr.ExtensionPoint as unknown as new (value: number) => xdr.ExtensionPoint)(0),
    resources: new xdr.SorobanResources({
      footprint: new xdr.LedgerFootprint({ readOnly: [key], readWrite: [] }),
      instructions: 1000,
      readBytes: 200,
      writeBytes: 50
    }),
    resourceFee: xdr.Int64.fromString(LARGE_FEE)
  }).toXDR("base64");
}

export function envelopeXdr() {
  const source = Keypair.fromRawEd25519Seed(Buffer.alloc(32, 3));
  const account = new Account(source.publicKey(), "10");
  return new TransactionBuilder(account, { fee: "100", networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.bumpSequence({ bumpTo: "11" }))
    .setTimeout(30)
    .build()
    .toXDR();
}

export function successSimulation() {
  return JSON.stringify({
    transactionData: transactionDataXdr(),
    minResourceFee: "250",
    results: [{ xdr: "AAAA" }]
  });
}
