import { xdr } from "@stellar/stellar-sdk";

const builders = xdr as unknown as {
  ScEnvMetaEntry: new (arm: string, value: object) => { toXDR: () => Buffer };
  ScEnvMetaEntryInterfaceVersion: new (value: object) => object;
  ScSpecEntry: {
    scSpecEntryFunctionV0: (value: object) => { toXDR: () => Buffer };
    scSpecEntryUdtErrorEnumV0: (value: object) => { toXDR: () => Buffer };
  };
  ScSpecFunctionV0: new (value: object) => object;
  ScSpecUdtErrorEnumV0: new (value: object) => object;
  ScSpecUdtErrorEnumCaseV0: new (value: object) => object;
  ScMetaEntry: { scMetaV0: (value: object) => { toXDR: () => Buffer } };
  ScMetaV0: new (value: object) => object;
};

function uleb(value: number): number[] {
  const bytes: number[] = [];
  let rest = value;
  do {
    let byte = rest & 0x7f;
    rest = Math.floor(rest / 128);
    if (rest > 0) byte |= 0x80;
    bytes.push(byte);
  } while (rest > 0);
  return bytes;
}

export function customSection(name: string, payload: Uint8Array): number[] {
  const nameBytes = Array.from(new TextEncoder().encode(name));
  const body = [...uleb(nameBytes.length), ...nameBytes, ...payload];
  return [0, ...uleb(body.length), ...body];
}

export function wasmModule(sections: number[][]): Uint8Array {
  return Uint8Array.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, ...sections.flat()]);
}

export function environmentXdr() {
  return new builders.ScEnvMetaEntry(
    "scEnvMetaKindInterfaceVersion",
    new builders.ScEnvMetaEntryInterfaceVersion({ protocol: 22, preRelease: 0 })
  ).toXDR();
}

export function specXdr() {
  const fn = builders.ScSpecEntry.scSpecEntryFunctionV0(new builders.ScSpecFunctionV0({
    doc: "pays",
    name: "pay",
    inputs: [],
    outputs: []
  }));
  const error = builders.ScSpecEntry.scSpecEntryUdtErrorEnumV0(new builders.ScSpecUdtErrorEnumV0({
    doc: "errs",
    lib: "",
    name: "PayErr",
    cases: [new builders.ScSpecUdtErrorEnumCaseV0({ doc: "no", name: "Missing", value: 1 })]
  }));
  return Buffer.concat([fn.toXDR(), error.toXDR()]);
}

export function metaXdr(key = "rsver", value = "1") {
  return builders.ScMetaEntry.scMetaV0(new builders.ScMetaV0({ key, val: value })).toXDR();
}

export function normalWasm() {
  return wasmModule([
    customSection("contractenvmetav0", environmentXdr()),
    customSection("contractspecv0", specXdr()),
    customSection("contractmetav0", metaXdr())
  ]);
}

export function toBase64(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64");
}
