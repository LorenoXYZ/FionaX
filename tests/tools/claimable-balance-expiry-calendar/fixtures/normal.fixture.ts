import { StrKey } from "@stellar/stellar-sdk";
export const claimant=StrKey.encodeEd25519PublicKey(Buffer.alloc(32,1));
export const issuer=StrKey.encodeEd25519PublicKey(Buffer.alloc(32,2));
export const balance={id:"a".repeat(72),paging_token:"64",asset:`USD:${issuer}`,amount:"922337203685.4775807",claimants:[{destination:claimant,predicate:{absBeforeEpoch:"1893456000"}}]};
export function response(records:unknown[],status=200){return new Response(JSON.stringify({_embedded:{records}}),{status});}
