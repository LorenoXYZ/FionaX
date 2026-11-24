import { decodeEnvironment, decodePublisher, decodeSpec } from "@/app/tools/wasm-custom-section-inspector/lib/soroban-section-decode";
import type { ScannedSection } from "@/app/tools/wasm-custom-section-inspector/lib/wasm-section-scan";
import type { WasmResult, WasmSectionView } from "@/app/tools/wasm-custom-section-inspector/types";

const ENV = "contractenvmetav0";
const SPEC = "contractspecv0";
const META = "contractmetav0";

function views(sections: ScannedSection[]): WasmSectionView[] {
  return sections.map((section) => ({
    index: section.index,
    id: section.id,
    name: section.customName,
    size: String(section.size)
  }));
}

export function coverSections(version: number, sections: ScannedSection[]): WasmResult {
  const named = (name: string) => sections.filter((section) => section.customName === name);
  const environmentSections = named(ENV);
  const specSections = named(SPEC);
  const metaSections = named(META);
  const environment = environmentSections.length === 0
    ? { status: "missing" as const, protocol: null, preRelease: null }
    : decodeOne(environmentSections, (body) => decodeEnvironment(body));
  const spec = specSections.length === 0
    ? { status: "missing" as const, functions: [], errors: [] }
    : decodeSpecSections(specSections);
  const publisher = metaSections.length === 0
    ? { status: "missing" as const, entries: [] }
    : decodeMetaSections(metaSections);
  const incomplete = [environment.status, spec.status, publisher.status].some((status) => status !== "present");
  return {
    version: String(version),
    sections: views(sections),
    environment,
    spec,
    publisher,
    completeness: incomplete ? "incomplete" : "complete"
  };
}

function decodeOne(
  sections: ScannedSection[],
  decode: (body: Uint8Array) => { protocol: string; preRelease: string } | null
): WasmResult["environment"] {
  const body = sections[0]?.customBody;
  const decoded = body ? decode(body) : null;
  if (!decoded) return { status: "undecodable", protocol: null, preRelease: null };
  return { status: "present", ...decoded };
}

function decodeSpecSections(sections: ScannedSection[]): WasmResult["spec"] {
  const decoded = sections.flatMap((section) => {
    const value = section.customBody ? decodeSpec(section.customBody) : null;
    return value ? [value] : [];
  });
  if (decoded.length !== sections.length) return { status: "undecodable", functions: [], errors: [] };
  return {
    status: "present",
    functions: decoded.flatMap((item) => item.functions),
    errors: decoded.flatMap((item) => item.errors)
  };
}

function decodeMetaSections(sections: ScannedSection[]): WasmResult["publisher"] {
  const decoded = sections.flatMap((section) => {
    const value = section.customBody ? decodePublisher(section.customBody) : null;
    return value ? [value] : [];
  });
  if (decoded.length !== sections.length) return { status: "undecodable", entries: [] };
  return { status: "present", entries: decoded.flat() };
}
