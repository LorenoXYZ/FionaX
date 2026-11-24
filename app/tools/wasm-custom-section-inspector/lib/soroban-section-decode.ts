import { xdr } from "@stellar/stellar-sdk";
import type { MetaEntryView, SpecErrorView, SpecFunctionView } from "@/app/tools/wasm-custom-section-inspector/types";

function textOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Uint8Array) return new TextDecoder().decode(value);
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) return value.toString("utf8");
  return String(value);
}

function readAll<T>(bytes: Uint8Array, parse: (slice: Buffer) => T): T[] | null {
  const values: T[] = [];
  let offset = 0;
  while (offset < bytes.length) {
    let next = -1;
    let value: T | null = null;
    for (let end = offset + 4; end <= bytes.length; end += 4) {
      try {
        value = parse(Buffer.from(bytes.subarray(offset, end)));
        next = end;
        break;
      } catch {
        value = null;
      }
    }
    if (value === null || next < 0) return null;
    values.push(value);
    offset = next;
  }
  return values;
}

export function decodeEnvironment(body: Uint8Array): { protocol: string; preRelease: string } | null {
  const values = readAll(body, (slice) => xdr.ScEnvMetaEntry.fromXDR(slice));
  const entry = values?.[0];
  if (!entry || values.length !== 1 || entry.switch().name !== "scEnvMetaKindInterfaceVersion") return null;
  const version = entry.interfaceVersion();
  return { protocol: String(version.protocol()), preRelease: String(version.preRelease()) };
}

export function decodeSpec(body: Uint8Array): { functions: SpecFunctionView[]; errors: SpecErrorView[] } | null {
  const values = readAll(body, (slice) => xdr.ScSpecEntry.fromXDR(slice));
  if (!values) return null;
  const functions: SpecFunctionView[] = [];
  const errors: SpecErrorView[] = [];
  for (const entry of values) {
    const arm = entry.switch().name;
    if (arm === "scSpecEntryFunctionV0") {
      const fn = entry.functionV0();
      functions.push({ name: textOf(fn.name()), doc: textOf(fn.doc()) });
    }
    if (arm === "scSpecEntryUdtErrorEnumV0") {
      const error = entry.udtErrorEnumV0();
      errors.push({
        name: textOf(error.name()),
        cases: error.cases().map((item) => ({ name: textOf(item.name()), value: String(item.value()) }))
      });
    }
  }
  return { functions, errors };
}

export function decodePublisher(body: Uint8Array): MetaEntryView[] | null {
  const values = readAll(body, (slice) => xdr.ScMetaEntry.fromXDR(slice));
  if (!values) return null;
  return values.map((entry) => ({ key: textOf(entry.v0().key()), value: textOf(entry.v0().val()) }));
}
