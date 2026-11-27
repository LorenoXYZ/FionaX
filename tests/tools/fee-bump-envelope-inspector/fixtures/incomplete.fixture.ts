import { makeEnvelope } from "./normal.fixture";
export function withoutInnerSignature() { return makeEnvelope({ innerSigned: false }); }
export function withoutOuterSignature() { return makeEnvelope({ outerSigned: false }); }
