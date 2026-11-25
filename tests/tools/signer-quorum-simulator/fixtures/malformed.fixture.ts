/** Malformed or unsupported inputs; none may produce an optimistic success. */

/** Not valid JSON. */
export const notJsonText = "{ this is not json";

/** Valid JSON, but not an object. */
export const arrayJson = JSON.stringify([1, 2, 3]);

/** An object missing the signers array. */
export const missingSignersJson = JSON.stringify({
  id: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
  thresholds: { low_threshold: 1, med_threshold: 2, high_threshold: 3 }
});

/** An object missing the thresholds block. */
export const missingThresholdsJson = JSON.stringify({
  id: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
  signers: []
});

/** A signer with an unsupported key prefix. */
export const unsupportedSignerJson = JSON.stringify({
  id: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
  thresholds: { low_threshold: 1, med_threshold: 2, high_threshold: 3 },
  signers: [
    {
      type: "ed25519_public_key",
      key: "MCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
      weight: 1
    }
  ]
});

/** A secret seed pasted as the account JSON. */
export const secretSeedJson = "SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
