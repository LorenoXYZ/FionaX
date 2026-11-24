import { nativeToScVal, StrKey } from "@stellar/stellar-sdk";
import type { EncodedSegment, EventFilterError, TopicPieceInput } from "@/app/tools/soroban-event-filter-builder/types";

const INTEGER = /^(0|[1-9][0-9]*)$/;
const SIGNED = /^-?(0|[1-9][0-9]*)$/;

function fail(code: EventFilterError["code"], message: string): { ok: false; error: EventFilterError } {
  return { ok: false, error: { code, message } };
}

export function encodeTopicSegment(
  piece: TopicPieceInput,
  position: number
): { ok: true; segment: EncodedSegment } | { ok: false; error: EventFilterError } {
  if (piece.type === "wildcard") {
    if (piece.value !== "*" && piece.value !== "**") {
      return fail("invalid_input", "A wildcard is * for one segment or ** for the rest of the topic.");
    }
    return {
      ok: true,
      segment: {
        position,
        kind: piece.value === "**" ? "multi" : "single",
        text: piece.value,
        source: piece.value
      }
    };
  }

  try {
    if (piece.type === "symbol") {
      if (!/^[_A-Za-z][_A-Za-z0-9]*$/.test(piece.value) || piece.value.length > 32) {
        return fail("invalid_input", "A symbol topic is 1–32 letters, digits, or underscores.");
      }
      return exact(position, `symbol:${piece.value}`, nativeToScVal(piece.value, { type: "symbol" }).toXDR("base64"));
    }
    if (piece.type === "string") {
      return exact(position, `string:${piece.value}`, nativeToScVal(piece.value, { type: "string" }).toXDR("base64"));
    }
    if (piece.type === "u32") {
      if (!INTEGER.test(piece.value) || BigInt(piece.value) > 4294967295n) {
        return fail("invalid_input", "A u32 topic must be an integer from 0 to 4294967295.");
      }
      return exact(position, `u32:${piece.value}`, nativeToScVal(Number(piece.value), { type: "u32" }).toXDR("base64"));
    }
    if (piece.type === "u64" || piece.type === "i64") {
      if (piece.type === "u64" && !INTEGER.test(piece.value)) {
        return fail("invalid_input", "A u64 topic must be a non-negative integer.");
      }
      if (piece.type === "i64" && !SIGNED.test(piece.value)) {
        return fail("invalid_input", "An i64 topic must be an integer.");
      }
      const value = BigInt(piece.value);
      return exact(position, `${piece.type}:${piece.value}`, nativeToScVal(value, { type: piece.type }).toXDR("base64"));
    }
    if (piece.type === "bool") {
      if (piece.value !== "true" && piece.value !== "false") {
        return fail("invalid_input", "A bool topic is true or false.");
      }
      return exact(position, `bool:${piece.value}`, nativeToScVal(piece.value === "true", { type: "bool" }).toXDR("base64"));
    }
    if (piece.type === "address") {
      if (!StrKey.isValidEd25519PublicKey(piece.value) && !StrKey.isValidContract(piece.value)) {
        return fail("invalid_input", "An address topic must be a G… account or a C… contract.");
      }
      return exact(position, `address:${piece.value}`, nativeToScVal(piece.value, { type: "address" }).toXDR("base64"));
    }
    if (piece.type === "bytes") {
      if (!/^[0-9a-fA-F]*$/.test(piece.value) || piece.value.length % 2 !== 0) {
        return fail("invalid_input", "A bytes topic is an even-length hex string.");
      }
      const bytes = Uint8Array.from(piece.value.match(/../g) ?? [], (pair) => Number.parseInt(pair, 16));
      return exact(position, `bytes:${piece.value}`, nativeToScVal(bytes, { type: "bytes" }).toXDR("base64"));
    }
  } catch {
    return fail("malformed_data", "That topic value could not be encoded as an ScVal.");
  }

  return fail("unsupported_variant", "That topic type is not part of the getEvents filter.");
}

function exact(position: number, source: string, text: string): { ok: true; segment: EncodedSegment } {
  return { ok: true, segment: { position, kind: "exact", text, source } };
}

export function encodeTopic(pieces: TopicPieceInput[]): { ok: true; segments: EncodedSegment[] } | { ok: false; error: EventFilterError } {
  if (pieces.length === 0) {
    return fail("invalid_input", "A topic filter needs at least one segment.");
  }
  const segments: EncodedSegment[] = [];
  let counted = 0;
  for (let index = 0; index < pieces.length; index += 1) {
    const piece = pieces[index];
    if (!piece) return fail("malformed_data", "A topic segment is missing.");
    const encoded = encodeTopicSegment(piece, index);
    if (!encoded.ok) return encoded;
    if (encoded.segment.kind === "multi" && index !== pieces.length - 1) {
      return fail("invalid_input", "The ** wildcard can only be the last segment.");
    }
    if (encoded.segment.kind !== "multi") counted += 1;
    segments.push(encoded.segment);
  }
  if (counted < 1 || counted > 4) {
    return fail("too_large", "A topic filter has 1 to 4 segments. ** does not count toward that limit.");
  }
  return { ok: true, segments };
}
