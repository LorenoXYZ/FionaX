export const missingMetrics = JSON.stringify({
  error: "HostError: storage",
  status: "error"
});

export const restoreSimulation = JSON.stringify({
  restorePreamble: { minResourceFee: "40" },
  error: "restore"
});
