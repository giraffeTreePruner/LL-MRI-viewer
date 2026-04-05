import * as d3 from 'd3';

/**
 * Build a diverging red-blue color scale centered at 0.
 *
 * IMPORTANT: domain is [maxDelta, -maxDelta] (reversed) because
 * d3.interpolateRdBu goes blue→red left-to-right, but we want
 * red = positive delta (improvement) and blue = negative (degradation).
 */
export function makeColorScale(data, metric) {
  const vals = data
    .flatMap((row) => row)
    .filter((v) => v !== null && v !== undefined && isFinite(v));

  if (vals.length === 0) return () => '#374151';

  const maxAbs = Math.max(Math.abs(d3.min(vals)), Math.abs(d3.max(vals)));
  if (maxAbs === 0) return () => '#374151';

  return d3.scaleSequential(d3.interpolateRdBu).domain([maxAbs, -maxAbs]);
}

export function nullColor() {
  return '#1f2937'; // gray-800 — unmeasured / invalid cell
}
