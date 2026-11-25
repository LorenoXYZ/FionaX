/** Missing evidence: omitted weights and thresholds. */

/** A signer with no weight and thresholds partially omitted. */
export const incompleteAccountJson = JSON.stringify({
  id: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
  thresholds: {
    low_threshold: 1,
    med_threshold: 2
    // high_threshold omitted
  },
  signers: [
    {
      type: "ed25519_public_key",
      key: "GCWYXRBKJYTHGCKTPNMFRVNWMFFUPQPCJSQSNOMLYPRDVRFJIDFPTB4I"
      // weight omitted
    }
  ]
});

export const incompleteSelection = [
  "GCWYXRBKJYTHGCKTPNMFRVNWMFFUPQPCJSQSNOMLYPRDVRFJIDFPTB4I"
];
