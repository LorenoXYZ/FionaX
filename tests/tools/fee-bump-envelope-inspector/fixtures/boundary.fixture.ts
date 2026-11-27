import { makeEnvelope } from "./normal.fixture";
export function highValues() { return makeEnvelope({ sequence: "9223372036854775806", fee: "922337203685477580" }); }
export function muxedPayer() { return makeEnvelope({ muxed: true }); }
