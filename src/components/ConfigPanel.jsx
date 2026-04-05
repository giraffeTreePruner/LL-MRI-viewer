export function ConfigPanel({ result, numLayers, isBaseline }) {
  if (!result) {
    return (
      <div className="text-sm text-gray-500 italic">
        Click a cell in the heatmap to see config details.
      </div>
    );
  }

  const [i, j] = result.config;
  const layerPath = result.layer_path ?? [];
  const dupLayers = new Set(result.duplicated_layers ?? []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold text-gray-100">
          Config ({i}, {j})
        </div>
        {isBaseline && (
          <span className="text-xs bg-yellow-700/40 text-yellow-300 border border-yellow-600/50 rounded px-2 py-0.5">
            ★ Baseline
          </span>
        )}
        {result.num_duplicated > 0 && (
          <span className="text-xs bg-orange-800/40 text-orange-300 border border-orange-600/50 rounded px-2 py-0.5">
            +{result.param_increase_pct}% params
          </span>
        )}
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-2">
        <ScoreCard label="PubMedQA" score={result.pubmedqa_score} delta={result.pubmedqa_delta} />
        <ScoreCard label="EQ-Bench" score={result.eq_score} delta={result.eq_delta} />
        <ScoreCard label="Combined" score={result.combined_score} delta={result.combined_delta} span />
      </div>

      {/* Layer info */}
      {result.num_duplicated > 0 && (
        <div className="text-xs text-gray-400">
          <span className="text-gray-300">{result.num_duplicated}</span> duplicated layers
          ({i}–{j - 1}), path length{' '}
          <span className="text-gray-300">{result.total_layers_in_path}</span>
        </div>
      )}

      {/* Layer path strip */}
      {layerPath.length > 0 && (
        <LayerStrip layerPath={layerPath} dupLayers={dupLayers} numLayers={numLayers} />
      )}
    </div>
  );
}

function ScoreCard({ label, score, delta, span }) {
  const dFmt = delta != null ? `${delta >= 0 ? '+' : ''}${delta.toFixed(4)}` : null;
  const dColor =
    delta == null ? ''
    : delta > 0.001 ? 'text-red-400'
    : delta < -0.001 ? 'text-blue-400'
    : 'text-gray-400';

  return (
    <div className={`bg-gray-800 rounded-lg p-2 ${span ? 'col-span-2' : ''}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold text-gray-100">
          {score != null ? score.toFixed(4) : '—'}
        </span>
        {dFmt && <span className={`text-xs font-medium ${dColor}`}>{dFmt}</span>}
      </div>
    </div>
  );
}

function LayerStrip({ layerPath, dupLayers, numLayers }) {
  // Show at most 60 blocks; if path is longer, summarise
  const MAX_SHOW = 60;
  const path = layerPath.slice(0, MAX_SHOW);
  const truncated = layerPath.length > MAX_SHOW;

  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">Layer execution path</div>
      <div className="flex flex-wrap gap-0.5">
        {path.map((layerIdx, pos) => {
          const isDup = dupLayers.has(layerIdx);
          return (
            <div
              key={pos}
              title={`Position ${pos}: layer ${layerIdx}${isDup ? ' (duplicated)' : ''}`}
              className={`w-4 h-4 rounded-sm flex items-center justify-center text-[8px] transition-colors ${
                isDup
                  ? 'bg-orange-500/80 text-orange-100'
                  : 'bg-gray-600 text-gray-400'
              }`}
            >
              {layerIdx}
            </div>
          );
        })}
        {truncated && (
          <div className="text-xs text-gray-600 self-center ml-1">
            +{layerPath.length - MAX_SHOW} more
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
        <span><span className="inline-block w-3 h-3 bg-gray-600 rounded-sm mr-1 align-middle" />Normal</span>
        <span><span className="inline-block w-3 h-3 bg-orange-500/80 rounded-sm mr-1 align-middle" />Duplicated</span>
      </div>
    </div>
  );
}
