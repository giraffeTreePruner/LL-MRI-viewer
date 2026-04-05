export function ComparisonTable({ selected, getResult, baseline }) {
  if (!selected || selected.length < 2) return null;

  const rows = selected.map(({ i, j }) => {
    const r = getResult(i, j);
    return { i, j, r };
  }).filter(({ r }) => r != null);

  if (rows.length < 2) return null;

  return (
    <div className="mt-4">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Config Comparison ({rows.length} selected)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-gray-700">
              <th className="text-left py-1 pr-3">Config</th>
              <th className="text-right py-1 pr-3">PubMedQA Δ</th>
              <th className="text-right py-1 pr-3">EQ Δ</th>
              <th className="text-right py-1 pr-3">Combined Δ</th>
              <th className="text-right py-1">Dups</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ i, j, r }) => (
              <tr key={`${i},${j}`} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="py-1 pr-3 text-gray-300 font-mono">({i},{j})</td>
                <td className={`py-1 pr-3 text-right font-mono ${deltaColor(r.pubmedqa_delta)}`}>
                  {fmt(r.pubmedqa_delta)}
                </td>
                <td className={`py-1 pr-3 text-right font-mono ${deltaColor(r.eq_delta)}`}>
                  {fmt(r.eq_delta)}
                </td>
                <td className={`py-1 pr-3 text-right font-mono ${deltaColor(r.combined_delta)}`}>
                  {fmt(r.combined_delta)}
                </td>
                <td className="py-1 text-right text-gray-400">{r.num_duplicated ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function fmt(v) {
  if (v == null) return '—';
  return (v >= 0 ? '+' : '') + v.toFixed(4);
}

function deltaColor(v) {
  if (v == null) return 'text-gray-500';
  if (v > 0.001) return 'text-red-400';
  if (v < -0.001) return 'text-blue-400';
  return 'text-gray-400';
}
