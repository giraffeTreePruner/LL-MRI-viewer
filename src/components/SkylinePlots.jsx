import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { computeMarginals } from '../utils/heatmapMath';

/**
 * Two small sparkline charts showing:
 *   S(i) — start-layer marginal (row means), docked below the heatmap
 *   E(j) — end-layer marginal (column means), docked to the right of the heatmap
 *
 * Both rendered as line + ±1σ band.
 */

const HEIGHT = 60;
const MARGIN = { top: 6, right: 8, bottom: 20, left: 36 };

function Sparkline({ data, xKey, width, color = '#818cf8', title }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const validData = data.filter((d) => d.mean != null);
    if (validData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerW = width - MARGIN.left - MARGIN.right;
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const xExtent = d3.extent(validData, (d) => d[xKey]);
    const xScale = d3.scaleLinear().domain(xExtent).range([0, innerW]);

    const allVals = validData.flatMap((d) => [
      d.mean - (d.std ?? 0),
      d.mean + (d.std ?? 0),
    ]);
    const yExtent = d3.extent(allVals);
    // Always include 0
    const yMin = Math.min(yExtent[0], 0);
    const yMax = Math.max(yExtent[1], 0);
    const yScale = d3.scaleLinear()
      .domain([yMin - Math.abs(yMin) * 0.1, yMax + Math.abs(yMax) * 0.1])
      .range([innerH, 0]);

    // Zero line
    g.append('line')
      .attr('x1', 0).attr('x2', innerW)
      .attr('y1', yScale(0)).attr('y2', yScale(0))
      .attr('stroke', '#374151').attr('stroke-dasharray', '3,3');

    // ±1σ band
    const area = d3.area()
      .x((d) => xScale(d[xKey]))
      .y0((d) => yScale(d.mean - (d.std ?? 0)))
      .y1((d) => yScale(d.mean + (d.std ?? 0)))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(validData)
      .attr('fill', color)
      .attr('fill-opacity', 0.15)
      .attr('d', area);

    // Mean line
    const line = d3.line()
      .x((d) => xScale(d[xKey]))
      .y((d) => yScale(d.mean))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(validData)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).ticks(5).tickSize(2))
      .call((a) => a.select('.domain').attr('stroke', '#374151'))
      .call((a) => a.selectAll('text').attr('fill', '#6b7280').attr('font-size', 9))
      .call((a) => a.selectAll('line').attr('stroke', '#374151'));

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(3).tickSize(2).tickFormat(d3.format('+.2f')))
      .call((a) => a.select('.domain').attr('stroke', '#374151'))
      .call((a) => a.selectAll('text').attr('fill', '#6b7280').attr('font-size', 9))
      .call((a) => a.selectAll('line').attr('stroke', '#374151'));
  }, [data, xKey, width, color]);

  return (
    <div>
      <div className="text-xs text-gray-500 mb-1 ml-9">{title}</div>
      <svg ref={svgRef} width={width} height={HEIGHT} />
    </div>
  );
}

export function SkylinePlots({ matrix, width }) {
  if (!matrix) return null;

  const { ej, si } = computeMarginals(matrix);

  return (
    <div className="space-y-2 mt-2">
      <Sparkline
        data={si}
        xKey="i"
        width={width}
        color="#f59e0b"
        title="S(i) — start-layer marginal (mean Δ by start layer)"
      />
      <Sparkline
        data={ej}
        xKey="j"
        width={width}
        color="#818cf8"
        title="E(j) — end-layer marginal (mean Δ by end layer)"
      />
    </div>
  );
}
