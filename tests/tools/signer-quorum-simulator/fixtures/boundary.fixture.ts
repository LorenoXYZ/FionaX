/**
 * Boundary accounts: exact thresholds, disabled master key, zero-weight signer,
 * and duplicate selections.
 */

/** Thresholds at the 8-bit boundary and a zero-weight signer. */
export const boundaryAccountJson = JSON.stringify({
  id: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
  thresholds: {
    low_threshold: 0,
    med_threshold: 255,
    high_threshold: 255
  },
  signers: [
    {
      type: "ed25519_public_key",
      key: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
      weight: 255
    },
    {
      type: "ed25519_public_key",
      key: "GCWYXRBKJYTHGCKTPNMFRVNWMFFUPQPCJSQSNOMLYPRDVRFJIDFPTB4I",
      weight: 0
    }
  ]
});

/** A disabled master key (weight 0) must still be counted, not dropped. */
export const disabledMasterKeyJson = JSON.stringify({
  id: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
  thresholds: {
    low_threshold: 1,
    med_threshold: 1,
    high_threshold: 1
  },
  signers: [
    {
      type: "ed25519_public_key",
      key: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
      weight: 0
    }
  ]
});

/** Exact-threshold selection: weight sums exactly to the medium threshold. */
export const exactThresholdSelection = [
  "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ"
];

/** Duplicate selection of the same signer twice. */
export const duplicateSelection = [
  "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
  "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ"
];
