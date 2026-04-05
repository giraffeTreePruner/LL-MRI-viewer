const METRICS = [
  { key: 'combined_delta', label: 'Combined', desc: 'Average of PubMedQA + EQ deltas' },
  { key: 'pubmedqa_delta', label: 'PubMedQA', desc: 'Biomedical yes/no/maybe accuracy delta' },
  { key: 'eq_delta', label: 'EQ-Bench', desc: 'Emotional intelligence score delta' },
  { key: 'balanced', label: 'Balanced', desc: 'min(PubMedQA Δ, EQ Δ) — both must improve' },
];

export function MetricToggle({ metric, onChange }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Metric
      </div>
      <div className="flex flex-col gap-1">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            title={m.desc}
            className={`text-left px-3 py-2 rounded text-sm transition-colors ${
              metric === m.key
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
