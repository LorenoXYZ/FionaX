import { CalendarFailure, type Predicate } from "../types";
const epoch = (v: unknown) => typeof v === "string" && /^(0|[1-9][0-9]{0,15})$/.test(v) && BigInt(v) <= 8640000000000n;
export function decodePredicate(raw: unknown, depth = 0): Predicate {
 if (depth > 16 || !raw || typeof raw !== "object" || Array.isArray(raw)) throw new CalendarFailure("malformed_data");
 const value = raw as Record<string, unknown>, keys = Object.keys(value);
 if (keys.length === 2 && keys.includes("absBefore") && keys.includes("absBeforeEpoch")) {
  if (typeof value.absBefore !== "string" || !epoch(value.absBeforeEpoch) || (Date.parse(value.absBefore) !== Number(BigInt(value.absBeforeEpoch as string) * 1000n) || new Date(Date.parse(value.absBefore)).toISOString() !== value.absBefore.replace("Z", ".000Z"))) throw new CalendarFailure("malformed_data");
  return { kind: "absolute", seconds: value.absBeforeEpoch as string };
 }
 if (keys.length !== 1) throw new CalendarFailure("malformed_data");
 if (keys[0] === "unconditional" && value.unconditional === true) return { kind: "unconditional" };
 if (keys[0] === "absBeforeEpoch" && epoch(value.absBeforeEpoch)) return { kind: "absolute", seconds: value.absBeforeEpoch as string };
 if (keys[0] === "absBefore" && typeof value.absBefore === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value.absBefore)) { const ms = Date.parse(value.absBefore); if (Number.isFinite(ms) && ms >= 0 && ms % 1000 === 0 && new Date(ms).toISOString() === value.absBefore.replace("Z", ".000Z")) return { kind: "absolute", seconds: String(ms / 1000) }; }
 if (keys[0] === "relBefore" && epoch(value.relBefore)) return { kind: "relative", seconds: value.relBefore as string };
 if ((keys[0] === "and" || keys[0] === "or") && Array.isArray(value[keys[0]]) && (value[keys[0]] as unknown[]).length >= 2 && (value[keys[0]] as unknown[]).length <= 32) return { kind: keys[0] as "and" | "or", children: (value[keys[0]] as unknown[]).map(v => decodePredicate(v, depth + 1)) };
 if (keys[0] === "not") return { kind: "not", child: decodePredicate(value.not, depth + 1) };
 throw new CalendarFailure(["absBefore","absBeforeEpoch","relBefore","unconditional","and","or"].includes(keys[0]) ? "malformed_data" : "unsupported_variant");
}
export function deadlineOf(predicate: Predicate): string | undefined { return predicate.kind === "absolute" ? predicate.seconds : undefined; }
export function unresolvedReason(predicate: Predicate): string { if (predicate.kind === "relative") return `Relative window (${predicate.seconds} seconds): creation time unavailable from this balance response.`; if (predicate.kind === "unconditional") return "Unconditional: no expiry deadline."; return "Compound or negated predicate: no single safe deadline can be inferred."; }
