import type { InspectorCode } from "./types";
export const copy = {
  title: "Fee-Bump Envelope Inspector",
  intro: "Decode a pasted fee-bump envelope locally using the network passphrase you supply.",
  idle: "Paste a base64 fee-bump transaction envelope and its exact network passphrase. Nothing is sent or saved.",
  loading: "Decoding locally…",
  incomplete: "Signatures are missing. The envelope can be inspected, but authorization and submission readiness cannot be confirmed.",
  caveat: "Hashes depend on the supplied passphrase. This tool does not verify signatures, ledger state, or submission readiness.",
  errors: {
    invalid_input: "Enter both the envelope and exact network passphrase. Secret seeds are not accepted.",
    malformed_data: "The envelope is not canonical base64 XDR. Check that the complete envelope was pasted.",
    unsupported_variant: "This is not a supported fee-bump envelope with a V1 inner transaction.",
    too_large: "The envelope exceeds 64 KiB, or the network passphrase exceeds 256 characters."
  } satisfies Record<InspectorCode, string>
};
