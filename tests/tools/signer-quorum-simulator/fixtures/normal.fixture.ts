/**
 * Deterministic valid account, derived from a protocol-correct Horizon account
 * JSON shape. Thresholds: low=1, medium=2, high=3. Master key weight=1.
 */

export const normalAccountJson = JSON.stringify({
  id: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
  account_id: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
  sequence: "101",
  thresholds: {
    low_threshold: 1,
    med_threshold: 2,
    high_threshold: 3
  },
  signers: [
    {
      type: "ed25519_public_key",
      key: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
      weight: 1
    },
    {
      type: "ed25519_public_key",
      key: "GCWYXRBKJYTHGCKTPNMFRVNWMFFUPQPCJSQSNOMLYPRDVRFJIDFPTB4I",
      weight: 2
    },
    {
      type: "sha256_hash",
      key: "X3DZ6RT4YBNR6Z4U3QH4QF7JSNP2TQWDMJ6VAK3F6U4MKTAQSYRA",
      weight: 1
    }
  ]
});

export const normalSelection = [
  "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
  "GCWYXRBKJYTHGCKTPNMFRVNWMFFUPQPCJSQSNOMLYPRDVRFJIDFPTB4I"
];
