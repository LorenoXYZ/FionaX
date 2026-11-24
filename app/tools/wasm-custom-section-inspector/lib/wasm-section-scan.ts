import type { WasmError } from "@/app/tools/wasm-custom-section-inspector/types";

export const MAX_WASM_BYTES = 1_048_576;
const U32_MAX = 4294967295n;

export interface ScannedSection {
  index: number;
  id: number;
  size: number;
  customName: string | null;
  customBody: Uint8Array | null;
}

function fail(code: WasmError["code"], message: string): { ok: false; error: WasmError } {
  return { ok: false, error: { code, message } };
}

function readUleb(bytes: Uint8Array, offset: number): { ok: true; value: number; next: number } | { ok: false; error: WasmError } {
  let value = 0n;
  let shift = 0n;
  let cursor = offset;
  for (let count = 0; count < 5; count += 1) {
    const byte = bytes[cursor];
    if (byte === undefined) return fail("malformed_data", "A section length ended before the module did.");
    cursor += 1;
    value += BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) {
      if (value > U32_MAX) return fail("malformed_data", "A section length does not fit in an unsigned 32-bit integer.");
      return { ok: true, value: Number(value), next: cursor };
    }
    shift += 7n;
  }
  return fail("malformed_data", "A section length is longer than an unsigned 32-bit LEB128.");
}

function readName(bytes: Uint8Array, offset: number, end: number): { ok: true; name: string; next: number } | { ok: false; error: WasmError } {
  const length = readUleb(bytes, offset);
  if (!length.ok) return length;
  const nameEnd = length.next + length.value;
  if (nameEnd > end) return fail("malformed_data", "A custom section name runs past the section.");
  try {
    const name = new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(length.next, nameEnd));
    return { ok: true, name, next: nameEnd };
  } catch {
    return fail("malformed_data", "A custom section name is not valid UTF-8.");
  }
}

export function scanWasm(bytes: Uint8Array): { ok: true; version: number; sections: ScannedSection[] } | { ok: false; error: WasmError } {
  if (bytes.length > MAX_WASM_BYTES) return fail("too_large", "The Wasm module is over 1 MiB.");
  if (bytes.length < 8) return fail("malformed_data", "The file is shorter than a Wasm header.");
  if (bytes[0] !== 0x00 || bytes[1] !== 0x61 || bytes[2] !== 0x73 || bytes[3] !== 0x6d) {
    return fail("malformed_data", "The file does not start with the Wasm magic number.");
  }
  const version = bytes[4]! + bytes[5]! * 256 + bytes[6]! * 65536 + bytes[7]! * 16777216;
  if (version !== 1) return fail("unsupported_variant", "Only Wasm version 1 is inspected.");
  const sections: ScannedSection[] = [];
  let offset = 8;
  while (offset < bytes.length) {
    const id = bytes[offset];
    if (id === undefined) break;
    offset += 1;
    const size = readUleb(bytes, offset);
    if (!size.ok) return size;
    const payloadEnd = size.next + size.value;
    if (payloadEnd > bytes.length) return fail("malformed_data", "A section length runs past the end of the module.");
    let customName: string | null = null;
    let customBody: Uint8Array | null = null;
    if (id === 0) {
      const name = readName(bytes, size.next, payloadEnd);
      if (!name.ok) return name;
      customName = name.name;
      customBody = bytes.subarray(name.next, payloadEnd);
    }
    sections.push({ index: sections.length, id, size: size.value, customName, customBody });
    offset = payloadEnd;
  }
  return { ok: true, version, sections };
}
