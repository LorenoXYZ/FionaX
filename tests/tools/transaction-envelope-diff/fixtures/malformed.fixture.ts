/** Malformed or unsupported inputs; none may produce an optimistic success. */

/** Not base64 at all. */
export const notBase64 = "!!!not-base64!!!";

/** Valid base64, but not XDR. */
export const base64NotXdr = Buffer.from("not a transaction").toString("base64");

/** Valid base64, but not a transaction envelope (a raw account ID). */
export const base64WrongType = Buffer.from("G".padEnd(35, "A")).toString("base64");

/** Empty input. */
export const emptyEnvelope = "";
