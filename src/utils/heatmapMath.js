/**
 * Compute skyline marginal arrays from a heatmap matrix.
 *
 * matrix[i][j] = delta value or null for unmeasured cells.
 * Valid configs: j > i  (upper-triangular, 1-indexed j).
 * Baseline (0,0) is excluded from marginals.
 *
 * E(j) = mean delta across all i < j   (end-layer marginal, column j)
 * S(i) = mean delta across all j > i   (start-layer marginal, row i)
 *
 * Returns { ej: [{j, mean, std}], si: [{i, mean, std}] }
 */
export function computeMarginals(matrix) {
  const N = matrix.length - 1; // number of transformer layers

  function stats(vals) {
    if (vals.length === 0) return { mean: null, std: null };
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
    return { mean, std: Math.sqrt(variance) };
  }

  const ej = [];
  for (let j = 1; j <= N; j++) {
    const vals = [];
    for (let i = 0; i < j; i++) {
      const v = matrix[i]?.[j];
      if (v !== null && v !== undefined && isFinite(v)) vals.push(v);
    }
    const { mean, std } = stats(vals);
    ej.push({ j, mean, std });
  }

  const si = [];
  for (let i = 0; i < N; i++) {
    const vals = [];
    for (let j = i + 1; j <= N; j++) {
      const v = matrix[i]?.[j];
      if (v !== null && v !== undefined && isFinite(v)) vals.push(v);
    }
    const { mean, std } = stats(vals);
    si.push({ i, mean, std });
  }

  return { ej, si };
}

/**
 * Compute "balanced" delta: min(pubmedqa_delta, eq_delta).
 * Both probes must improve. Returns null if either is missing.
 */
export function balancedDelta(pmqaDelta, eqDelta) {
  if (pmqaDelta == null || eqDelta == null) return null;
  return Math.min(pmqaDelta, eqDelta);
}

/**
 * Build a balanced_delta matrix from pubmedqa and eq matrices.
 */
export function buildBalancedMatrix(pmqaMatrix, eqMatrix) {
  if (!pmqaMatrix || !eqMatrix) return null;
  return pmqaMatrix.map((row, i) =>
    row.map((val, j) => balancedDelta(val, eqMatrix[i]?.[j]))
  );
}
