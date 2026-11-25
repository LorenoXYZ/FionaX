import { FeeBumpTransaction, xdr } from "@stellar/stellar-sdk";
import { InspectorFailure } from "./feeBumpEnvelopeInspector.errors";
export function decodeFeeBump(envelope: string, passphrase: string) {
  let decoded: xdr.TransactionEnvelope;
  try { decoded = xdr.TransactionEnvelope.fromXDR(envelope, "base64"); }
  catch { throw new InspectorFailure("malformed_data"); }
  if (decoded.switch().name !== "envelopeTypeTxFeeBump") throw new InspectorFailure("unsupported_variant");
  if (decoded.feeBump().tx().innerTx().switch().name !== "envelopeTypeTx") throw new InspectorFailure("unsupported_variant");
  try { return { raw: decoded.feeBump(), transaction: new FeeBumpTransaction(decoded, passphrase) }; }
  catch { throw new InspectorFailure("malformed_data"); }
}
